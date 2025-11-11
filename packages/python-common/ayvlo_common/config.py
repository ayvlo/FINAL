"""Shared configuration utilities."""

import os
from typing import Any

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseServiceSettings(BaseSettings):
    """Base settings for all Ayvlo services."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_env: str = Field(default="development", description="Application environment")
    service_name: str = Field(..., description="Service name")
    log_level: str = Field(default="INFO", description="Logging level")

    # Database
    postgres_url: str = Field(..., description="PostgreSQL connection URL")
    clickhouse_url: str | None = Field(None, description="ClickHouse connection URL")

    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", description="Redis URL")

    # Kafka/Redpanda
    redpanda_broker: str = Field(..., description="Redpanda broker address")
    redpanda_security_protocol: str = Field(default="PLAINTEXT")
    redpanda_sasl_mechanism: str = Field(default="PLAIN")
    redpanda_username: str | None = None
    redpanda_password: str | None = None
    schema_registry_url: str = Field(default="http://localhost:8081")

    # Observability
    sentry_dsn: str | None = None
    otel_exporter_otlp_endpoint: str = Field(default="http://localhost:4318")
    otel_resource_attributes: str = Field(default="")

    @field_validator("app_env")
    @classmethod
    def validate_env(cls, v: str) -> str:
        """Validate environment."""
        allowed = ["development", "staging", "production", "test"]
        if v not in allowed:
            raise ValueError(f"app_env must be one of {allowed}")
        return v

    @property
    def is_production(self) -> bool:
        """Check if running in production."""
        return self.app_env == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development."""
        return self.app_env == "development"


def get_settings() -> BaseServiceSettings:
    """Get service settings."""
    return BaseServiceSettings(service_name=os.getenv("SERVICE_NAME", "ayvlo"))
