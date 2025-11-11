"""Metrics API endpoints"""

from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
import uuid
import structlog

from app.models.metric import (
    MetricCreate,
    MetricBatchCreate,
    MetricQuery,
    MetricResponse,
    MetricAggregateResponse,
    IngestResponse,
)
from app.core.clickhouse import clickhouse_client
from app.core.redis import redis_client
from app.core.config import settings

logger = structlog.get_logger()
router = APIRouter()


async def get_tenant_id(x_tenant_id: Optional[str] = Header(None)) -> str:
    """Extract tenant ID from header"""
    if not x_tenant_id:
        raise HTTPException(status_code=401, detail="Missing X-Tenant-ID header")
    return x_tenant_id


async def check_rate_limit(tenant_id: str, limit_type: str = "ingestion"):
    """Check rate limit for tenant"""
    limit = settings.RATE_LIMIT_INGESTION if limit_type == "ingestion" else settings.RATE_LIMIT_QUERY
    key = f"rate_limit:{tenant_id}:{limit_type}"

    exceeded = await redis_client.check_rate_limit(key, limit)
    if exceeded:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded: {limit} requests per minute"
        )


@router.post("/ingest", response_model=IngestResponse)
async def ingest_metric(
    metric: MetricCreate,
    tenant_id: str = Depends(get_tenant_id),
):
    """Ingest a single metric"""

    await check_rate_limit(tenant_id, "ingestion")

    try:
        metric_id = uuid.uuid4()
        data = [{
            "tenant_id": tenant_id,
            "metric_id": str(metric_id),
            "metric_name": metric.metric_name,
            "timestamp": metric.timestamp.isoformat(),
            "value": metric.value,
            "dimensions": metric.dimensions or {},
            "metadata": metric.metadata or {},
        }]

        clickhouse_client.insert_metrics(data)

        logger.info(
            "Metric ingested",
            tenant_id=tenant_id,
            metric_name=metric.metric_name,
            value=metric.value,
        )

        return IngestResponse(
            success=True,
            count=1,
            message="Metric ingested successfully",
        )

    except Exception as e:
        logger.error("Failed to ingest metric", exc_info=e, tenant_id=tenant_id)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ingest/batch", response_model=IngestResponse)
async def ingest_metrics_batch(
    batch: MetricBatchCreate,
    tenant_id: str = Depends(get_tenant_id),
):
    """Ingest metrics in batch"""

    await check_rate_limit(tenant_id, "ingestion")

    if len(batch.metrics) > settings.BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Batch size exceeds limit of {settings.BATCH_SIZE}",
        )

    try:
        data = []
        for metric in batch.metrics:
            metric_id = uuid.uuid4()
            data.append({
                "tenant_id": tenant_id,
                "metric_id": str(metric_id),
                "metric_name": metric.metric_name,
                "timestamp": metric.timestamp.isoformat(),
                "value": metric.value,
                "dimensions": metric.dimensions or {},
                "metadata": metric.metadata or {},
            })

        clickhouse_client.insert_metrics(data)

        logger.info(
            "Metrics batch ingested",
            tenant_id=tenant_id,
            count=len(data),
        )

        return IngestResponse(
            success=True,
            count=len(data),
            message=f"{len(data)} metrics ingested successfully",
        )

    except Exception as e:
        logger.error("Failed to ingest metrics batch", exc_info=e, tenant_id=tenant_id)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/query", response_model=list[MetricResponse] | list[MetricAggregateResponse])
async def query_metrics(
    query: MetricQuery,
    tenant_id: str = Depends(get_tenant_id),
):
    """Query metrics with filters"""

    await check_rate_limit(tenant_id, "query")

    try:
        if query.aggregate:
            # Query aggregated hourly data
            rows = clickhouse_client.query_aggregated(
                tenant_id=tenant_id,
                metric_name=query.metric_name,
                start_time=query.start_time.isoformat(),
                end_time=query.end_time.isoformat(),
            )

            return [
                MetricAggregateResponse(
                    timestamp=row[0],
                    count=row[1],
                    avg=row[2],
                    min=row[3],
                    max=row[4],
                    p50=row[5],
                    p95=row[6],
                    p99=row[7],
                )
                for row in rows
            ]
        else:
            # Query raw metrics
            rows = clickhouse_client.query_metrics(
                tenant_id=tenant_id,
                metric_name=query.metric_name,
                start_time=query.start_time.isoformat(),
                end_time=query.end_time.isoformat(),
                dimensions=query.dimensions,
            )

            return [
                MetricResponse(
                    timestamp=row[0],
                    value=row[1],
                    dimensions=row[2] if row[2] else {},
                    metadata=row[3] if row[3] else {},
                )
                for row in rows
            ]

    except Exception as e:
        logger.error("Failed to query metrics", exc_info=e, tenant_id=tenant_id)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list/{tenant_id}")
async def list_metrics(tenant_id: str):
    """List all metric names for a tenant"""

    try:
        query = f"""
        SELECT DISTINCT metric_name
        FROM metrics
        WHERE tenant_id = '{tenant_id}'
        ORDER BY metric_name
        """

        result = clickhouse_client.client.query(query)
        metric_names = [row[0] for row in result.result_rows]

        return {"tenant_id": tenant_id, "metrics": metric_names, "count": len(metric_names)}

    except Exception as e:
        logger.error("Failed to list metrics", exc_info=e, tenant_id=tenant_id)
        raise HTTPException(status_code=500, detail=str(e))
