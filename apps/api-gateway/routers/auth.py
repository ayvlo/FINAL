"""Authentication endpoints."""

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from packages.python_common.ayvlo_common.auth import create_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    """Login request."""

    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Login response with JWT token."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400  # 24 hours


class RegisterRequest(BaseModel):
    """Registration request."""

    email: EmailStr
    password: str
    name: str
    org_name: str


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest) -> LoginResponse:
    """Authenticate user and return JWT token.

    TODO: Implement actual authentication logic with database lookup
    """

    # Placeholder - implement real auth
    if request.email == "demo@ayvlo.com" and request.password == "demo":
        token = create_access_token(
            subject="user_123",
            org_id="org_456",
            secret_key="your-secret-key",  # TODO: get from config
            expires_delta=timedelta(hours=24),
            roles=["admin"],
            scopes=["metrics:read", "metrics:write", "actions:execute"],
        )
        return LoginResponse(access_token=token)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
    )


@router.post("/register", response_model=LoginResponse)
async def register(request: RegisterRequest) -> LoginResponse:
    """Register new user and organization.

    TODO: Implement actual registration logic
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Registration not implemented yet",
    )


@router.post("/logout")
async def logout() -> dict[str, str]:
    """Logout user (client-side token deletion)."""
    return {"message": "Successfully logged out"}
