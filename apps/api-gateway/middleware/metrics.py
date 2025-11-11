"""Prometheus metrics middleware."""

import time
from typing import Callable

from fastapi import Request, Response
from prometheus_client import Counter, Histogram
from starlette.middleware.base import BaseHTTPMiddleware


# Prometheus metrics
http_requests_total = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"],
)

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency",
    ["method", "endpoint"],
    buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0),
)

http_request_size_bytes = Histogram(
    "http_request_size_bytes",
    "HTTP request size in bytes",
    ["method", "endpoint"],
)

http_response_size_bytes = Histogram(
    "http_response_size_bytes",
    "HTTP response size in bytes",
    ["method", "endpoint"],
)


class MetricsMiddleware(BaseHTTPMiddleware):
    """Prometheus metrics collection middleware."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Record request metrics."""

        # Skip metrics for /metrics endpoint itself
        if request.url.path == "/metrics":
            return await call_next(request)

        method = request.method
        path = request.url.path

        # Measure request size
        request_size = int(request.headers.get("content-length", 0))
        http_request_size_bytes.labels(method=method, endpoint=path).observe(request_size)

        # Measure request duration
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time

        # Record metrics
        http_requests_total.labels(
            method=method,
            endpoint=path,
            status_code=response.status_code,
        ).inc()

        http_request_duration_seconds.labels(method=method, endpoint=path).observe(duration)

        # Measure response size
        response_size = int(response.headers.get("content-length", 0))
        http_response_size_bytes.labels(method=method, endpoint=path).observe(response_size)

        return response
