"""Health check endpoints"""

from fastapi import APIRouter, HTTPException
from app.core.clickhouse import clickhouse_client
from app.core.redis import redis_client
import structlog

logger = structlog.get_logger()
router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "service": "metrics",
        "version": "1.0.0",
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check - verifies all dependencies"""

    health = {
        "clickhouse": False,
        "redis": False,
    }

    try:
        # Check ClickHouse
        if clickhouse_client.client:
            result = clickhouse_client.client.query("SELECT 1")
            health["clickhouse"] = len(result.result_rows) > 0

        # Check Redis
        if redis_client.client:
            await redis_client.client.ping()
            health["redis"] = True

        all_healthy = all(health.values())

        if not all_healthy:
            raise HTTPException(status_code=503, detail=health)

        return {
            "status": "ready",
            "dependencies": health,
        }

    except Exception as e:
        logger.error("Readiness check failed", exc_info=e)
        raise HTTPException(status_code=503, detail={"status": "not ready", "dependencies": health})


@router.get("/live")
async def liveness_check():
    """Liveness check - simple ping"""
    return {"status": "alive"}
