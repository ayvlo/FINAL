"""Configuration management using Pydantic Settings"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # Service
    SERVICE_NAME: str = "metrics"
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")

    # API
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8000"],
        env="CORS_ORIGINS",
    )

    # ClickHouse
    CLICKHOUSE_HOST: str = Field(default="localhost", env="CLICKHOUSE_HOST")
    CLICKHOUSE_PORT: int = Field(default=8123, env="CLICKHOUSE_PORT")
    CLICKHOUSE_USER: str = Field(default="default", env="CLICKHOUSE_USER")
    CLICKHOUSE_PASSWORD: str = Field(default="", env="CLICKHOUSE_PASSWORD")
    CLICKHOUSE_DATABASE: str = Field(default="ayvlo", env="CLICKHOUSE_DATABASE")

    # PostgreSQL (for metadata)
    POSTGRES_HOST: str = Field(default="localhost", env="POSTGRES_HOST")
    POSTGRES_PORT: int = Field(default=5432, env="POSTGRES_PORT")
    POSTGRES_USER: str = Field(default="ayvlo", env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(default="ayvlo", env="POSTGRES_PASSWORD")
    POSTGRES_DB: str = Field(default="ayvlo", env="POSTGRES_DB")

    @property
    def postgres_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis
    REDIS_HOST: str = Field(default="localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(default=6379, env="REDIS_PORT")
    REDIS_DB: int = Field(default=0, env="REDIS_DB")
    REDIS_PASSWORD: str = Field(default="", env="REDIS_PASSWORD")

    # Auth
    JWT_SECRET_KEY: str = Field(default="dev-secret-key-change-in-production", env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60

    # Rate Limiting
    RATE_LIMIT_INGESTION: int = Field(default=1000, env="RATE_LIMIT_INGESTION")  # per minute
    RATE_LIMIT_QUERY: int = Field(default=100, env="RATE_LIMIT_QUERY")  # per minute

    # Batch Processing
    BATCH_SIZE: int = Field(default=1000, env="BATCH_SIZE")
    BATCH_TIMEOUT_SECONDS: int = Field(default=5, env="BATCH_TIMEOUT_SECONDS")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
