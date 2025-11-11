"""Shared database models with multi-tenant RLS."""

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import (
    JSON,
    BigInteger,
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Double,
    Enum,
    ForeignKey,
    Index,
    Integer,
    PrimaryKeyConstraint,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import CITEXT, TSTZRANGE, UUID
from sqlalchemy.orm import relationship

from packages.python_common.ayvlo_common.database import Base


def utcnow() -> datetime:
    """Get current UTC time."""
    return datetime.now(timezone.utc)


class Org(Base):
    """Organization (tenant) table."""

    __tablename__ = "orgs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    plan = Column(Text)  # free, pro, enterprise
    region = Column(Text)  # us, eu
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    memberships = relationship("Membership", back_populates="org", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="org", cascade="all, delete-orphan")
    datasources = relationship("DataSource", back_populates="org", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="org", cascade="all, delete-orphan")


class User(Base):
    """User table."""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(CITEXT, unique=True, nullable=False)
    name = Column(Text)
    avatar_url = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan")
    owned_metrics = relationship("Metric", back_populates="owner", foreign_keys="Metric.owner_id")


class Membership(Base):
    """User-Organization membership with role."""

    __tablename__ = "memberships"

    org_id = Column(UUID(as_uuid=True), ForeignKey("orgs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    role = Column(
        Enum(
            "owner", "admin", "builder", "analyst", "viewer", name="membership_role", create_type=True
        ),
        nullable=False,
    )
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    __table_args__ = (PrimaryKeyConstraint("org_id", "user_id"),)

    # Relationships
    org = relationship("Org", back_populates="memberships")
    user = relationship("User", back_populates="memberships")


class Project(Base):
    """Project within an organization."""

    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("orgs.id", ondelete="CASCADE"), nullable=False)
    name = Column(Text, nullable=False)
    env = Column(
        Enum("dev", "staging", "prod", name="project_env", create_type=True), nullable=False
    )
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    org = relationship("Org", back_populates="projects")
    metrics = relationship("Metric", back_populates="project", cascade="all, delete-orphan")

    __table_args__ = (Index("idx_projects_org_id", "org_id"),)


class DataSource(Base):
    """Data source configuration."""

    __tablename__ = "datasources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("orgs.id", ondelete="CASCADE"), nullable=False)
    kind = Column(Text, nullable=False)  # stripe, hubspot, webhook, etc.
    config = Column(JSON, nullable=False)  # encrypted connection details
    enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    org = relationship("Org", back_populates="datasources")

    __table_args__ = (Index("idx_datasources_org_id", "org_id"),)


class Metric(Base):
    """Metric definition."""

    __tablename__ = "metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("orgs.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(Text, nullable=False)
    mql = Column(Text, nullable=False)  # Metric Query Language
    description = Column(Text)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    project = relationship("Project", back_populates="metrics")
    owner = relationship("User", back_populates="owned_metrics")
    anomalies = relationship("Anomaly", back_populates="metric", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("org_id", "name", name="uq_metrics_org_name"),
        Index("idx_metrics_org_id", "org_id"),
        Index("idx_metrics_project_id", "project_id"),
    )


class Event(Base):
    """Raw event stream table."""

    __tablename__ = "events"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    org_id = Column(UUID(as_uuid=True), nullable=False)
    topic = Column(Text, nullable=False)
    payload = Column(JSON, nullable=False)
    ts = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    metadata = Column(JSON)

    __table_args__ = (
        Index("idx_events_org_id", "org_id"),
        Index("idx_events_ts", "ts"),
        Index("idx_events_org_ts", "org_id", "ts"),
    )


class Anomaly(Base):
    """Detected anomaly."""

    __tablename__ = "anomalies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_id = Column(
        UUID(as_uuid=True), ForeignKey("metrics.id", ondelete="CASCADE"), nullable=False
    )
    org_id = Column(UUID(as_uuid=True), nullable=False)  # denormalized for RLS
    window = Column(TSTZRANGE, nullable=False)  # time range
    score = Column(Double, nullable=False)
    severity = Column(
        Enum("low", "medium", "high", "critical", name="anomaly_severity", create_type=True),
        nullable=False,
    )
    explanation = Column(JSON)  # causal analysis & narrative
    acknowledged = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    metric = relationship("Metric", back_populates="anomalies")
    action_runs = relationship("ActionRun", back_populates="anomaly", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_anomalies_metric_id", "metric_id"),
        Index("idx_anomalies_org_id", "org_id"),
        Index("idx_anomalies_created_at", "created_at"),
    )


class Workflow(Base):
    """Action workflow (playbook)."""

    __tablename__ = "workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("orgs.id", ondelete="CASCADE"), nullable=False)
    name = Column(Text, nullable=False)
    playbook = Column(JSON, nullable=False)  # YAML playbook definition
    enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    org = relationship("Org", back_populates="workflows")
    action_runs = relationship("ActionRun", back_populates="workflow", cascade="all, delete-orphan")

    __table_args__ = (Index("idx_workflows_org_id", "org_id"),)


class ActionRun(Base):
    """Action execution record."""

    __tablename__ = "action_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(
        UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False
    )
    anomaly_id = Column(
        UUID(as_uuid=True), ForeignKey("anomalies.id", ondelete="SET NULL"), nullable=True
    )
    org_id = Column(UUID(as_uuid=True), nullable=False)  # denormalized for RLS
    status = Column(
        Enum(
            "pending",
            "running",
            "success",
            "failed",
            "cancelled",
            name="action_status",
            create_type=True,
        ),
        nullable=False,
        default="pending",
    )
    result = Column(JSON)
    error = Column(Text)
    idempotency_key = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    completed_at = Column(DateTime(timezone=True))

    # Relationships
    workflow = relationship("Workflow", back_populates="action_runs")
    anomaly = relationship("Anomaly", back_populates="action_runs")

    __table_args__ = (
        Index("idx_action_runs_workflow_id", "workflow_id"),
        Index("idx_action_runs_org_id", "org_id"),
        Index("idx_action_runs_created_at", "created_at"),
        Index("idx_action_runs_idempotency_key", "idempotency_key"),
    )


class AuditLog(Base):
    """Append-only audit log."""

    __tablename__ = "audit_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    org_id = Column(UUID(as_uuid=True), nullable=False)
    actor = Column(Text, nullable=False)  # user_id or system
    action = Column(Text, nullable=False)  # e.g., "metric.create", "workflow.delete"
    target = Column(Text, nullable=False)  # resource ID
    meta = Column(JSON)  # additional context
    ip_address = Column(Text)
    user_agent = Column(Text)
    at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    __table_args__ = (
        Index("idx_audit_logs_org_id", "org_id"),
        Index("idx_audit_logs_at", "at"),
        Index("idx_audit_logs_org_at", "org_id", "at"),
        Index("idx_audit_logs_actor", "actor"),
    )
