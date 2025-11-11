"""Structured logging setup."""

import logging
import sys
from typing import Any

import structlog
from opentelemetry import trace


def setup_logging(service_name: str, log_level: str = "INFO") -> None:
    """Configure structured logging with OpenTelemetry integration.

    Args:
        service_name: Name of the service
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            _add_trace_context,
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, log_level.upper())
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def _add_trace_context(
    logger: logging.Logger, method_name: str, event_dict: dict[str, Any]
) -> dict[str, Any]:
    """Add OpenTelemetry trace context to logs."""
    span = trace.get_current_span()
    if span and span.is_recording():
        ctx = span.get_span_context()
        event_dict["trace_id"] = format(ctx.trace_id, "032x")
        event_dict["span_id"] = format(ctx.span_id, "016x")
    return event_dict


def get_logger(name: str) -> structlog.BoundLogger:
    """Get a structured logger.

    Args:
        name: Logger name (usually __name__)

    Returns:
        Configured structured logger
    """
    return structlog.get_logger(name)
