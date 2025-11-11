"""Rate limiting middleware using Redis sliding window."""

import time
from typing import Callable

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from redis.asyncio import Redis
from starlette.middleware.base import BaseHTTPMiddleware
import structlog

logger = structlog.get_logger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Redis-based rate limiting with sliding window algorithm."""

    def __init__(
        self,
        app: Callable,
        redis_url: str,
        rate_limit: int = 60,
        window_seconds: int = 60,
    ) -> None:
        """Initialize rate limit middleware.

        Args:
            app: ASGI application
            redis_url: Redis connection URL
            rate_limit: Max requests per window (default: 60)
            window_seconds: Time window in seconds (default: 60)
        """
        super().__init__(app)
        self.redis = Redis.from_url(redis_url, decode_responses=True)
        self.rate_limit = rate_limit
        self.window_seconds = window_seconds

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Check rate limit and process request."""

        # Skip rate limiting for health checks
        if request.url.path.startswith("/health"):
            return await call_next(request)

        # Determine rate limit key (by org_id if authenticated, else by IP)
        if hasattr(request.state, "org_id"):
            key = f"ratelimit:org:{request.state.org_id}"
        else:
            client_ip = request.client.host if request.client else "unknown"
            key = f"ratelimit:ip:{client_ip}"

        # Current timestamp
        now = int(time.time())
        window_start = now - self.window_seconds

        try:
            # Use Redis sorted set for sliding window
            pipe = self.redis.pipeline()

            # Remove old entries outside window
            pipe.zremrangebyscore(key, 0, window_start)

            # Count requests in current window
            pipe.zcard(key)

            # Add current request
            pipe.zadd(key, {str(now): now})

            # Set expiry
            pipe.expire(key, self.window_seconds)

            results = await pipe.execute()
            current_count = results[1]

            # Check if limit exceeded
            if current_count >= self.rate_limit:
                logger.warning(
                    "Rate limit exceeded",
                    key=key,
                    count=current_count,
                    limit=self.rate_limit,
                    path=request.url.path,
                )

                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": "rate_limit_exceeded",
                        "message": f"Rate limit of {self.rate_limit} requests per minute exceeded",
                        "retry_after": self.window_seconds,
                    },
                    headers={
                        "Retry-After": str(self.window_seconds),
                        "X-RateLimit-Limit": str(self.rate_limit),
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": str(now + self.window_seconds),
                    },
                )

            # Allow request
            response = await call_next(request)

            # Add rate limit headers
            remaining = max(0, self.rate_limit - current_count - 1)
            response.headers["X-RateLimit-Limit"] = str(self.rate_limit)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            response.headers["X-RateLimit-Reset"] = str(now + self.window_seconds)

            return response

        except Exception as e:
            logger.exception("Rate limit check failed", error=str(e))
            # Fail open - allow request if rate limiting fails
            return await call_next(request)
