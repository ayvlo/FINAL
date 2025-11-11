"""Pydantic models for metrics"""

from pydantic import BaseModel, Field, UUID4
from datetime import datetime
from typing import Dict, Optional


class MetricCreate(BaseModel):
    """Model for creating a new metric"""

    metric_name: str = Field(..., description="Name of the metric (e.g., 'revenue', 'signups')")
    value: float = Field(..., description="Numeric value of the metric")
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Timestamp of the metric")
    dimensions: Optional[Dict[str, str]] = Field(default_factory=dict, description="Dimension tags (e.g., {'region': 'us-west', 'plan': 'pro'})")
    metadata: Optional[Dict[str, str]] = Field(default_factory=dict, description="Additional metadata")


class MetricBatchCreate(BaseModel):
    """Model for batch metric ingestion"""

    metrics: list[MetricCreate] = Field(..., description="List of metrics to ingest")


class MetricResponse(BaseModel):
    """Model for metric query response"""

    timestamp: datetime
    value: float
    dimensions: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, str]] = None


class MetricAggregateResponse(BaseModel):
    """Model for aggregated metric response"""

    timestamp: datetime
    count: int
    avg: float
    min: float
    max: float
    p50: float
    p95: float
    p99: float


class MetricQuery(BaseModel):
    """Model for metric query parameters"""

    metric_name: str = Field(..., description="Name of the metric to query")
    start_time: datetime = Field(..., description="Start of time range")
    end_time: datetime = Field(..., description="End of time range")
    dimensions: Optional[Dict[str, str]] = Field(default=None, description="Dimension filters")
    aggregate: bool = Field(default=False, description="Return hourly aggregates instead of raw data")


class IngestResponse(BaseModel):
    """Response for metric ingestion"""

    success: bool
    count: int
    message: str
