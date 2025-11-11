"""Configuration management"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # Service
    SERVICE_NAME: str = "anomalies"
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")

    # API
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"],
        env="CORS_ORIGINS",
    )

    # Metrics Service
    METRICS_SERVICE_URL: str = Field(
        default="http://localhost:8001",
        env="METRICS_SERVICE_URL",
    )

    # Redis
    REDIS_HOST: str = Field(default="localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(default=6379, env="REDIS_PORT")
    REDIS_DB: int = Field(default=1, env="REDIS_DB")
    REDIS_PASSWORD: str = Field(default="", env="REDIS_PASSWORD")

    # ML Configuration
    MIN_DATA_POINTS: int = Field(default=30, env="MIN_DATA_POINTS")
    PROPHET_INTERVAL_WIDTH: float = Field(default=0.99, env="PROPHET_INTERVAL_WIDTH")
    ISOLATION_CONTAMINATION: float = Field(default=0.05, env="ISOLATION_CONTAMINATION")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
