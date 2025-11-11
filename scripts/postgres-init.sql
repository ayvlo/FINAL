-- Ayvlo PostgreSQL Initialization Script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'starter',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Metric Configurations table
CREATE TABLE IF NOT EXISTS metric_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    detection_enabled BOOLEAN DEFAULT TRUE,
    sensitivity VARCHAR(50) DEFAULT 'medium',
    alert_channels JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, metric_name)
);

-- Anomaly History table
CREATE TABLE IF NOT EXISTS anomaly_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    expected_value DOUBLE PRECISION,
    anomaly_score DOUBLE PRECISION NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Action Workflows table
CREATE TABLE IF NOT EXISTS action_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    integration_type VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    config JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, integration_type, name)
);

-- Indexes for performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_api_keys_tenant_id ON api_keys(tenant_id);
CREATE INDEX idx_metric_configs_tenant_id ON metric_configs(tenant_id);
CREATE INDEX idx_anomaly_history_tenant_id ON anomaly_history(tenant_id);
CREATE INDEX idx_anomaly_history_timestamp ON anomaly_history(timestamp);
CREATE INDEX idx_action_workflows_tenant_id ON action_workflows(tenant_id);
CREATE INDEX idx_integrations_tenant_id ON integrations(tenant_id);

-- Insert sample tenant for development
INSERT INTO tenants (id, name, slug, plan, status)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Acme Corp', 'acme', 'growth', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user
INSERT INTO users (id, tenant_id, email, name, role)
VALUES (
    '223e4567-e89b-12d3-a456-426614174001',
    '123e4567-e89b-12d3-a456-426614174000',
    'john@acme.com',
    'John Doe',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample metric configurations
INSERT INTO metric_configs (tenant_id, metric_name, display_name, description, unit, detection_enabled)
VALUES
    ('123e4567-e89b-12d3-a456-426614174000', 'revenue', 'Revenue', 'Monthly Recurring Revenue', 'USD', TRUE),
    ('123e4567-e89b-12d3-a456-426614174000', 'signups', 'Signups', 'Daily user signups', 'count', TRUE),
    ('123e4567-e89b-12d3-a456-426614174000', 'churn_rate', 'Churn Rate', 'Customer churn percentage', 'percent', TRUE)
ON CONFLICT (tenant_id, metric_name) DO NOTHING;

COMMIT;
