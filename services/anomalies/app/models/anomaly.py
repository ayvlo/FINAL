"""Pydantic models for anomalies"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict


class DetectRequest(BaseModel):
    """Request to detect anomalies"""

    metric_name: str = Field(..., description="Name of the metric to analyze")
    start_time: datetime = Field(..., description="Start of time range")
    end_time: datetime = Field(..., description="End of time range")
    dimensions: Optional[Dict[str, str]] = Field(default=None, description="Dimension filters")


class AnomalyPoint(BaseModel):
    """Single anomaly data point"""

    timestamp: str
    value: float
    score: float = Field(..., ge=0.0, le=1.0, description="Anomaly score (0-1)")
    index: int


class DetectionSummary(BaseModel):
    """Summary of detection results"""

    total_points: int
    anomaly_count: int
    severity: str = Field(..., description="Severity level: none, low, info, warning, critical")
    prophet_detections: Optional[int] = None
    isolation_detections: Optional[int] = None
    error: Optional[str] = None


class DetectResponse(BaseModel):
    """Response from anomaly detection"""

    metric_name: str
    tenant_id: str
    anomalies: List[AnomalyPoint]
    summary: DetectionSummary
    algorithms: Optional[Dict[str, List[int]]] = None
