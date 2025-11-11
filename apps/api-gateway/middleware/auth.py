"""Authentication middleware for JWT and OAuth."""

import uuid
from typing import Callable

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import structlog

from packages.python_common.ayvlo_common.auth import AuthError, verify_token

logger = structlog.get_logger(__name__)

# Public endpoints that don't require authentication
PUBLIC_PATHS = {
    "/health",
    "/health/ready",
    "/health/live",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/metrics",
    "/v1/auth/login",
    "/v1/auth/register",
    "/v1/auth/callback",
}


class AuthMiddleware(BaseHTTPMiddleware):
    """JWT authentication middleware with multi-tenant support."""

    def __init__(
        self,
        app: Callable,
        secret_key: str,
        auth0_domain: str | None = None,
        workos_api_key: str | None = None,
    ) -> None:
        """Initialize auth middleware.

        Args:
            app: ASGI application
            secret_key: Secret key for JWT verification
            auth0_domain: Auth0 domain (optional)
            workos_api_key: WorkOS API key (optional)
        """
        super().__init__(app)
        self.secret_key = secret_key
        self.auth0_domain = auth0_domain
        self.workos_api_key = workos_api_key

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request and verify authentication."""

        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        # Skip auth for public paths
        if any(request.url.path.startswith(path) for path in PUBLIC_PATHS):
            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response

        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            logger.warning("Missing or invalid Authorization header", path=request.url.path)
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "error": "unauthorized",
                    "message": "Missing or invalid Authorization header",
                    "request_id": request_id,
                },
                headers={"X-Request-ID": request_id},
            )

        token = auth_header.split(" ", 1)[1]

        try:
            # Verify token
            payload = verify_token(token, self.secret_key)

            # Attach user context to request
            request.state.user_id = payload.sub
            request.state.org_id = payload.org_id
            request.state.roles = payload.roles
            request.state.scopes = payload.scopes

            logger.info(
                "Request authenticated",
                user_id=payload.sub,
                org_id=payload.org_id,
                path=request.url.path,
                request_id=request_id,
            )

            # Set RLS context for database queries
            # This would be done in a database middleware or dependency
            request.state.rls_context = {
                "org_id": payload.org_id,
                "user_id": payload.sub,
            }

            response = await call_next(request)
            response.headers["X-Request-ID"] = request_id
            return response

        except AuthError as e:
            logger.warning(
                "Authentication failed",
                error=str(e),
                path=request.url.path,
                request_id=request_id,
            )
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "error": "unauthorized",
                    "message": str(e),
                    "request_id": request_id,
                },
                headers={"X-Request-ID": request_id},
            )
