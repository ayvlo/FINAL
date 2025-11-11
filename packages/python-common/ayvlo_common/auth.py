"""Authentication and authorization utilities."""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from pydantic import BaseModel


class TokenPayload(BaseModel):
    """JWT token payload."""

    sub: str  # subject (user_id)
    org_id: str
    exp: int
    iat: int
    roles: list[str] = []
    scopes: list[str] = []


class AuthError(Exception):
    """Authentication error."""

    pass


def create_access_token(
    subject: str,
    org_id: str,
    secret_key: str,
    expires_delta: timedelta = timedelta(hours=24),
    roles: list[str] | None = None,
    scopes: list[str] | None = None,
) -> str:
    """Create JWT access token.

    Args:
        subject: Token subject (user ID)
        org_id: Organization ID
        secret_key: Secret key for signing
        expires_delta: Token expiration time
        roles: User roles
        scopes: Token scopes

    Returns:
        Encoded JWT token
    """
    now = datetime.now(timezone.utc)
    expire = now + expires_delta

    payload: dict[str, Any] = {
        "sub": subject,
        "org_id": org_id,
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
        "roles": roles or [],
        "scopes": scopes or [],
    }

    return jwt.encode(payload, secret_key, algorithm="HS256")


def verify_token(token: str, secret_key: str) -> TokenPayload:
    """Verify and decode JWT token.

    Args:
        token: JWT token string
        secret_key: Secret key for verification

    Returns:
        Decoded token payload

    Raises:
        AuthError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return TokenPayload(**payload)
    except JWTError as e:
        raise AuthError(f"Invalid token: {str(e)}") from e


def has_scope(token_payload: TokenPayload, required_scope: str) -> bool:
    """Check if token has required scope.

    Args:
        token_payload: Decoded token payload
        required_scope: Required scope string

    Returns:
        True if token has the scope
    """
    return required_scope in token_payload.scopes


def has_role(token_payload: TokenPayload, required_role: str) -> bool:
    """Check if token has required role.

    Args:
        token_payload: Decoded token payload
        required_role: Required role string

    Returns:
        True if token has the role
    """
    return required_role in token_payload.roles
