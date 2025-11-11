"""Initial schema with multi-tenant RLS

Revision ID: 001
Revises:
Create Date: 2025-01-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create initial schema with RLS policies."""

    # Enable required extensions
    op.execute("CREATE EXTENSION IF NOT EXISTS citext")
    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

    # Create enum types
    op.execute("CREATE TYPE membership_role AS ENUM ('owner', 'admin', 'builder', 'analyst', 'viewer')")
    op.execute("CREATE TYPE project_env AS ENUM ('dev', 'staging', 'prod')")
    op.execute("CREATE TYPE anomaly_severity AS ENUM ('low', 'medium', 'high', 'critical')")
    op.execute("CREATE TYPE action_status AS ENUM ('pending', 'running', 'success', 'failed', 'cancelled')")

    # Create tables (models defined in services/shared/models.py)
    # Tables are created by SQLAlchemy, here we add RLS policies

    # Enable RLS on all tenant tables
    tables_with_rls = [
        'orgs', 'projects', 'datasources', 'metrics',
        'events', 'anomalies', 'workflows', 'action_runs', 'audit_logs'
    ]

    for table in tables_with_rls:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")

        # Create RLS policy: users can only see rows from their org
        op.execute(f"""
            CREATE POLICY tenant_isolation_policy ON {table}
            FOR ALL
            USING (org_id = current_setting('app.current_org_id', TRUE)::uuid)
        """)

    # Special policy for memberships table (uses both org_id and user_id)
    op.execute("ALTER TABLE memberships ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY tenant_isolation_policy ON memberships
        FOR ALL
        USING (org_id = current_setting('app.current_org_id', TRUE)::uuid)
    """)

    # Users table - users can see themselves and org members
    op.execute("ALTER TABLE users ENABLE ROW LEVEL SECURITY")
    op.execute("""
        CREATE POLICY user_policy ON users
        FOR ALL
        USING (
            id = current_setting('app.current_user_id', TRUE)::uuid
            OR id IN (
                SELECT user_id FROM memberships
                WHERE org_id = current_setting('app.current_org_id', TRUE)::uuid
            )
        )
    """)

    # Create function to set RLS context
    op.execute("""
        CREATE OR REPLACE FUNCTION set_rls_context(p_org_id uuid, p_user_id uuid)
        RETURNS void AS $$
        BEGIN
            PERFORM set_config('app.current_org_id', p_org_id::text, false);
            PERFORM set_config('app.current_user_id', p_user_id::text, false);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)


def downgrade() -> None:
    """Drop schema and RLS policies."""

    # Drop function
    op.execute("DROP FUNCTION IF EXISTS set_rls_context")

    # Drop RLS policies (tables will be dropped by SQLAlchemy)
    tables = [
        'orgs', 'users', 'memberships', 'projects', 'datasources',
        'metrics', 'events', 'anomalies', 'workflows', 'action_runs', 'audit_logs'
    ]

    for table in tables:
        op.execute(f"DROP POLICY IF EXISTS tenant_isolation_policy ON {table}")
        op.execute(f"DROP POLICY IF EXISTS user_policy ON {table}")

    # Drop enum types
    op.execute("DROP TYPE IF EXISTS action_status")
    op.execute("DROP TYPE IF EXISTS anomaly_severity")
    op.execute("DROP TYPE IF EXISTS project_env")
    op.execute("DROP TYPE IF EXISTS membership_role")
