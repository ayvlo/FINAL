"""Health check endpoints"""

from fastapi import APIRouter
from app.core.redis import redis_client
import structlog

logger = structlog.get_logger()
router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "service": "anomalies",
        "version": "1.0.0",
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check"""

    health = {"redis": False}

    try:
        # Check Redis
        if redis_client.client:
            await redis_client.client.ping()
            health["redis"] = True

        return {
            "status": "ready",
            "dependencies": health,
        }

    except Exception as e:
        logger.error("Readiness check failed", exc_info=e)
        return {"status": "not ready", "dependencies": health}


@router.get("/live")
async def liveness_check():
    """Liveness check"""
    return {"status": "alive"}
