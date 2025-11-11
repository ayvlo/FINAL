"""Metrics API endpoints."""

from datetime import datetime
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Query, Request, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter()


class TimeseriesPoint(BaseModel):
    """Single timeseries data point."""

    ts: datetime
    value: float


class QueryMetricRequest(BaseModel):
    """Query metric timeseries request."""

    metric_id: UUID
    window: str = Field(..., description="Time window: 1h, 24h, 7d, 30d, 90d")
    granularity: str = Field(default="1h", description="Data granularity: 1m, 5m, 1h, 1d")


class QueryMetricResponse(BaseModel):
    """Query metric response."""

    metric_id: UUID
    name: str
    data: list[TimeseriesPoint]
    window: str
    granularity: str


class CreateMetricRequest(BaseModel):
    """Create metric request."""

    project_id: UUID
    name: str
    mql: str = Field(..., description="Metric Query Language expression")
    description: str | None = None


class MetricResponse(BaseModel):
    """Metric response."""

    id: UUID
    org_id: UUID
    project_id: UUID
    name: str
    mql: str
    description: str | None
    created_at: datetime


@router.post("/query", response_model=QueryMetricResponse)
async def query_metric(request: Request, body: QueryMetricRequest) -> QueryMetricResponse:
    """Query metric timeseries data.

    Requires scope: metrics:read
    """

    # TODO: Implement actual query logic with ClickHouse
    # For now, return mock data
    return QueryMetricResponse(
        metric_id=body.metric_id,
        name="revenue_mrr",
        data=[
            TimeseriesPoint(ts=datetime.now(), value=125000.0),
        ],
        window=body.window,
        granularity=body.granularity,
    )


@router.post("", response_model=MetricResponse, status_code=status.HTTP_201_CREATED)
async def create_metric(request: Request, body: CreateMetricRequest) -> MetricResponse:
    """Create a new metric.

    Requires scope: metrics:write
    """

    # TODO: Implement actual creation logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Metric creation not implemented yet",
    )


@router.get("", response_model=list[MetricResponse])
async def list_metrics(
    request: Request,
    project_id: UUID | None = None,
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
) -> list[MetricResponse]:
    """List metrics for the organization.

    Requires scope: metrics:read
    """

    # TODO: Implement actual listing logic
    return []


@router.get("/{metric_id}", response_model=MetricResponse)
async def get_metric(request: Request, metric_id: UUID) -> MetricResponse:
    """Get metric by ID.

    Requires scope: metrics:read
    """

    # TODO: Implement actual retrieval logic
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Metric not found")
