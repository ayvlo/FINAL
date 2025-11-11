"""
Ayvlo Anomalies Service - FastAPI Application
ML ensemble for anomaly detection: Prophet + IsolationForest + LSTM
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
import structlog

from app.api import anomalies, health
from app.core.config import settings
from app.core.redis import redis_client
from app.ml.detector import AnomalyDetector

logger = structlog.get_logger()


# Global ML detector instance
detector: AnomalyDetector | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global detector

    # Startup
    logger.info("Starting Ayvlo Anomalies Service", version="1.0.0")

    # Initialize Redis
    await redis_client.connect()
    logger.info("Redis connected", host=settings.REDIS_HOST)

    # Initialize ML detector
    detector = AnomalyDetector()
    logger.info("ML detector initialized")

    yield

    # Shutdown
    logger.info("Shutting down Ayvlo Anomalies Service")
    await redis_client.disconnect()


app = FastAPI(
    title="Ayvlo Anomalies Service",
    description="ML-powered anomaly detection with Prophet, IsolationForest, and LSTM ensemble",
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
app.include_router(anomalies.router, prefix="/api/v1/anomalies", tags=["Anomalies"])

# Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


# Make detector accessible to routes
def get_detector() -> AnomalyDetector:
    return detector


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_config=None,
    )
