"""Ayvlo API Gateway - Public REST API with auth, rate limiting, and observability."""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app
import structlog

from packages.python_common.ayvlo_common.config import BaseServiceSettings
from packages.python_common.ayvlo_common.database import DatabaseManager
from packages.python_common.ayvlo_common.logging import setup_logging
from packages.python_common.ayvlo_common.observability import setup_observability

from .middleware.auth import AuthMiddleware
from .middleware.ratelimit import RateLimitMiddleware
from .middleware.metrics import MetricsMiddleware
from .routers import auth, metrics, anomalies, actions, audit, health

logger = structlog.get_logger(__name__)


class Settings(BaseServiceSettings):
    """API Gateway specific settings."""

    service_name: str = "api-gateway"
    secret_key: str
    auth0_domain: str | None = None
    auth0_client_id: str | None = None
    workos_api_key: str | None = None
    cors_origins: list[str] = ["http://localhost:3000", "https://*.vercel.app"]
    rate_limit_per_minute: int = 60
    enable_swagger: bool = True


# Lifespan context for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager."""
    logger.info("Starting API Gateway", version=app.version)

    # Initialize database
    app.state.db = DatabaseManager(app.state.settings.postgres_url)

    # Setup observability
    if app.state.settings.sentry_dsn:
        setup_observability(
            service_name=app.state.settings.service_name,
            service_namespace="ayvlo",
            deployment_environment=app.state.settings.app_env,
            otlp_endpoint=app.state.settings.otel_exporter_otlp_endpoint,
            sentry_dsn=app.state.settings.sentry_dsn,
        )

    logger.info("API Gateway started successfully")

    yield

    # Cleanup
    logger.info("Shutting down API Gateway")
    await app.state.db.close()


# Create FastAPI app
def create_app() -> FastAPI:
    """Create and configure FastAPI application."""

    # Load settings
    settings = Settings(service_name="api-gateway")

    # Setup structured logging
    setup_logging(settings.service_name, settings.log_level)

    # Create app
    app = FastAPI(
        title="Ayvlo API",
        description="Autonomous Business Intelligence & Action Platform API",
        version="1.0.0",
        docs_url="/docs" if settings.enable_swagger else None,
        redoc_url="/redoc" if settings.enable_swagger else None,
        openapi_url="/openapi.json" if settings.enable_swagger else None,
        lifespan=lifespan,
    )

    # Store settings
    app.state.settings = settings

    # Add middleware (order matters!)
    # 1. Trusted host (security)
    if settings.is_production:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["*.ayvlo.com", "ayvlo.com"],
        )

    # 2. CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID"],
    )

    # 3. GZip compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # 4. Metrics (custom)
    app.add_middleware(MetricsMiddleware)

    # 5. Rate limiting (custom)
    app.add_middleware(
        RateLimitMiddleware,
        redis_url=settings.redis_url,
        rate_limit=settings.rate_limit_per_minute,
    )

    # 6. Authentication (custom)
    app.add_middleware(
        AuthMiddleware,
        secret_key=settings.secret_key,
        auth0_domain=settings.auth0_domain,
        workos_api_key=settings.workos_api_key,
    )

    # Exception handlers
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Handle all unhandled exceptions."""
        logger.exception("Unhandled exception", exc_info=exc, path=request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "internal_server_error",
                "message": "An unexpected error occurred",
                "request_id": request.state.request_id if hasattr(request.state, "request_id") else None,
            },
        )

    # Include routers
    app.include_router(health.router, prefix="/health", tags=["Health"])
    app.include_router(auth.router, prefix="/v1/auth", tags=["Authentication"])
    app.include_router(metrics.router, prefix="/v1/metrics", tags=["Metrics"])
    app.include_router(anomalies.router, prefix="/v1/anomalies", tags=["Anomalies"])
    app.include_router(actions.router, prefix="/v1/actions", tags=["Actions"])
    app.include_router(audit.router, prefix="/v1/audit", tags=["Audit"])

    # Mount Prometheus metrics at /metrics
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)

    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_config=None,  # Use our custom logging
    )
