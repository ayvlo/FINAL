"""Anomalies API endpoints"""

from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
import structlog
import httpx

from app.models.anomaly import DetectRequest, DetectResponse, AnomalyPoint, DetectionSummary
from app.core.config import settings
from app.ml.detector import AnomalyDetector
from app.main import get_detector

logger = structlog.get_logger()
router = APIRouter()


async def get_tenant_id(x_tenant_id: Optional[str] = Header(None)) -> str:
    """Extract tenant ID from header"""
    if not x_tenant_id:
        raise HTTPException(status_code=401, detail="Missing X-Tenant-ID header")
    return x_tenant_id


@router.post("/detect", response_model=DetectResponse)
async def detect_anomalies(
    request: DetectRequest,
    tenant_id: str = Depends(get_tenant_id),
    detector: AnomalyDetector = Depends(get_detector),
):
    """
    Detect anomalies in a metric using ML ensemble.

    Process:
    1. Fetch metric data from Metrics Service
    2. Run Prophet + IsolationForest detection
    3. Ensemble voting (2/3 agreement)
    4. Return anomalies with severity
    """

    try:
        # Fetch metric data from Metrics Service
        logger.info(
            "Fetching metric data",
            tenant_id=tenant_id,
            metric=request.metric_name,
            start=request.start_time,
            end=request.end_time,
        )

        metric_data = await fetch_metric_data(
            tenant_id=tenant_id,
            metric_name=request.metric_name,
            start_time=request.start_time.isoformat(),
            end_time=request.end_time.isoformat(),
            dimensions=request.dimensions,
        )

        if not metric_data:
            return DetectResponse(
                metric_name=request.metric_name,
                tenant_id=tenant_id,
                anomalies=[],
                summary=DetectionSummary(
                    total_points=0,
                    anomaly_count=0,
                    severity="none",
                    error="No metric data found for specified time range",
                ),
            )

        # Extract timestamps and values
        timestamps = [point["timestamp"] for point in metric_data]
        values = [point["value"] for point in metric_data]

        logger.info(
            "Running anomaly detection",
            metric=request.metric_name,
            data_points=len(timestamps),
        )

        # Run ML detection
        result = detector.detect(
            timestamps=timestamps,
            values=values,
            metric_name=request.metric_name,
        )

        # Convert to response model
        anomalies = [AnomalyPoint(**point) for point in result["anomalies"]]
        summary = DetectionSummary(**result["summary"])

        logger.info(
            "Anomaly detection complete",
            tenant_id=tenant_id,
            metric=request.metric_name,
            anomalies=len(anomalies),
            severity=summary.severity,
        )

        return DetectResponse(
            metric_name=request.metric_name,
            tenant_id=tenant_id,
            anomalies=anomalies,
            summary=summary,
            algorithms=result.get("algorithms"),
        )

    except Exception as e:
        logger.error("Anomaly detection failed", exc_info=e, tenant_id=tenant_id)
        raise HTTPException(status_code=500, detail=str(e))


async def fetch_metric_data(
    tenant_id: str,
    metric_name: str,
    start_time: str,
    end_time: str,
    dimensions: Optional[dict] = None,
) -> list[dict]:
    """Fetch metric data from Metrics Service"""

    url = f"{settings.METRICS_SERVICE_URL}/api/v1/metrics/query"

    payload = {
        "metric_name": metric_name,
        "start_time": start_time,
        "end_time": end_time,
        "dimensions": dimensions,
        "aggregate": False,  # Need raw data for ML
    }

    headers = {"X-Tenant-ID": tenant_id}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers, timeout=30.0)
            response.raise_for_status()

            data = response.json()
            return data if data else []

        except httpx.HTTPError as e:
            logger.error(
                "Failed to fetch metric data",
                exc_info=e,
                metric=metric_name,
                url=url,
            )
            raise HTTPException(
                status_code=502,
                detail=f"Failed to fetch metric data from Metrics Service: {str(e)}",
            )


@router.get("/metrics/{tenant_id}")
async def list_monitored_metrics(tenant_id: str):
    """List all metrics being monitored for anomalies"""

    # TODO: Implement metric tracking in database
    # For now, return placeholder

    return {
        "tenant_id": tenant_id,
        "monitored_metrics": [
            {
                "metric_name": "revenue",
                "status": "active",
                "last_check": "2025-01-15T10:30:00Z",
                "anomalies_detected": 3,
            },
            {
                "metric_name": "signups",
                "status": "active",
                "last_check": "2025-01-15T10:30:00Z",
                "anomalies_detected": 0,
            },
        ],
    }
