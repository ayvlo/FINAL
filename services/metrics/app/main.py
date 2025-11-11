"""
Ayvlo Metrics Service - FastAPI Application
Handles metric ingestion, storage, and querying with ClickHouse
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
import structlog
from app.api import metrics, health
from app.core.config import settings
from app.core.clickhouse import clickhouse_client
from app.core.redis import redis_client

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("Starting Ayvlo Metrics Service", version="1.0.0")

    # Initialize ClickHouse connection
    await clickhouse_client.connect()
    logger.info("ClickHouse connected", host=settings.CLICKHOUSE_HOST)

    # Initialize Redis connection
    await redis_client.connect()
    logger.info("Redis connected", host=settings.REDIS_HOST)

    yield

    # Shutdown
    logger.info("Shutting down Ayvlo Metrics Service")
    await clickhouse_client.disconnect()
    await redis_client.disconnect()


app = FastAPI(
    title="Ayvlo Metrics Service",
    description="High-performance metrics ingestion and querying with ClickHouse",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", exc_info=exc, path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


# Routes
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(metrics.router, prefix="/api/v1/metrics", tags=["Metrics"])

# Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_config=None,  # Use structlog
    )
