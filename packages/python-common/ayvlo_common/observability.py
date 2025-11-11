"""Observability and telemetry setup."""

from typing import Any

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration


def setup_observability(
    service_name: str,
    service_namespace: str,
    deployment_environment: str,
    otlp_endpoint: str,
    sentry_dsn: str | None = None,
    sample_rate: float = 1.0,
) -> None:
    """Setup OpenTelemetry and Sentry.

    Args:
        service_name: Name of the service
        service_namespace: Service namespace
        deployment_environment: Deployment environment
        otlp_endpoint: OTLP collector endpoint
        sentry_dsn: Sentry DSN (optional)
        sample_rate: Trace sampling rate (0.0-1.0)
    """
    # OpenTelemetry setup
    resource = Resource.create(
        {
            "service.name": service_name,
            "service.namespace": service_namespace,
            "deployment.environment": deployment_environment,
        }
    )

    provider = TracerProvider(resource=resource)

    # OTLP exporter
    otlp_exporter = OTLPSpanExporter(endpoint=f"{otlp_endpoint}/v1/traces")
    provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

    trace.set_tracer_provider(provider)

    # Auto-instrumentation
    FastAPIInstrumentor().instrument()
    SQLAlchemyInstrumentor().instrument()
    RedisInstrumentor().instrument()

    # Sentry setup
    if sentry_dsn:
        sentry_sdk.init(
            dsn=sentry_dsn,
            environment=deployment_environment,
            traces_sample_rate=sample_rate,
            profiles_sample_rate=sample_rate,
            integrations=[FastApiIntegration()],
        )


def get_tracer(name: str) -> trace.Tracer:
    """Get OpenTelemetry tracer.

    Args:
        name: Tracer name (usually __name__)

    Returns:
        Tracer instance
    """
    return trace.get_tracer(name)
