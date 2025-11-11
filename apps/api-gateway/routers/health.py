"""Health check endpoints."""

from fastapi import APIRouter, Request, status
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    service: str
    version: str


class ReadinessResponse(BaseModel):
    """Readiness check response with dependencies."""

    status: str
    service: str
    version: str
    dependencies: dict[str, str]


@router.get("", response_model=HealthResponse)
@router.get("/live", response_model=HealthResponse)
async def liveness(request: Request) -> HealthResponse:
    """Liveness probe - is the service running?"""
    return HealthResponse(
        status="healthy",
        service="api-gateway",
        version="1.0.0",
    )


@router.get("/ready", response_model=ReadinessResponse)
async def readiness(request: Request) -> ReadinessResponse:
    """Readiness probe - can the service handle requests?"""

    dependencies = {}

    # Check database
    try:
        async with request.app.state.db.session() as session:
            await session.execute("SELECT 1")
        dependencies["database"] = "healthy"
    except Exception:
        dependencies["database"] = "unhealthy"

    # Check Redis
    # TODO: implement Redis check

    # Overall status
    overall_status = "ready" if all(v == "healthy" for v in dependencies.values()) else "not_ready"

    return ReadinessResponse(
        status=overall_status,
        service="api-gateway",
        version="1.0.0",
        dependencies=dependencies,
    )
