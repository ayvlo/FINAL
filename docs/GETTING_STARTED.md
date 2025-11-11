# Getting Started with Ayvlo

Welcome to Ayvlo! This guide will get you up and running in under 10 minutes.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ayvlo/core.git
cd core
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Install Python dependencies
pip install -e ".[dev]"
```

### 3. Set Up Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and fill in required values
# At minimum, set:
# - POSTGRES_URL
# - REDIS_URL
# - SECRET_KEY (generate with: openssl rand -hex 32)
```

### 4. Start Local Infrastructure

```bash
# Start all services (Postgres, Redis, ClickHouse, Redpanda, etc.)
docker compose up -d

# Wait for services to be healthy
docker compose ps
```

### 5. Run Database Migrations

```bash
# Apply migrations
alembic upgrade head

# Verify tables created
psql $POSTGRES_URL -c "\dt"
```

### 6. Start the API Gateway

```bash
# Terminal 1: API Gateway
cd apps/api-gateway
uvicorn main:app --reload --port 8000
```

### 7. Start the Web Dashboard

```bash
# Terminal 2: Next.js web app
cd apps/web
npm run dev
```

### 8. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Login (demo credentials)
curl -X POST http://localhost:8000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@ayvlo.com", "password": "demo"}'

# Save the access_token from response

# Query metrics (replace TOKEN)
curl http://localhost:8000/v1/metrics \
  -H "Authorization: Bearer TOKEN"
```

### 9. Open the Dashboard

Navigate to http://localhost:3000 and login with demo credentials.

## Next Steps

### Connect Your First Data Source

1. Go to Settings → Data Sources
2. Click "Add Source"
3. Select Stripe, HubSpot, or Webhook
4. Follow OAuth flow or enter API keys
5. Test connection

### Create Your First Metric

1. Go to Metrics → Create New
2. Name: "Daily Revenue"
3. MQL: `SELECT sum(amount) FROM stripe_charges WHERE status='succeeded' GROUP BY date`
4. Set owner and project
5. Save

### Set Up Anomaly Detection

1. Go to Anomaly Detection
2. Enable detection for "Daily Revenue"
3. Configure sensitivity (low/medium/high)
4. Set notification channels

### Create Your First Action

1. Go to Actions → Create Workflow
2. Name: "Slack Alert on Revenue Drop"
3. Trigger: Anomaly detected on Daily Revenue, severity=high
4. Action: Send Slack message to #finance
5. Enable workflow

## Development Workflow

### Running Tests

```bash
# Python tests
pytest

# Integration tests
pytest -m integration

# Frontend tests
cd apps/web && npm test

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Lint & format Python
make format

# Lint & format TypeScript
pnpm lint
pnpm format

# Type checking
make typecheck
```

### Making Changes

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Add tests
4. Run linting & tests
5. Commit with conventional commit format: `feat: add new metric type`
6. Push and create PR

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                  Next.js 15 (apps/web)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                  FastAPI (apps/api-gateway)                  │
│           Auth • Rate Limiting • OpenAPI                     │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                    ↓
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Metrics       │  │   Anomalies     │  │   Actions       │
│   Service       │  │   Service       │  │   Service       │
│  (gRPC/REST)    │  │  (ML Ensemble)  │  │  (Playbooks)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         ↓                                         ↓
┌─────────────────┐                      ┌─────────────────┐
│   PostgreSQL    │                      │   ClickHouse    │
│   (OLTP+RLS)    │                      │   (OLAP/TS)     │
└─────────────────┘                      └─────────────────┘
```

## Key Concepts

### Metrics
Metrics are time-series measurements of business KPIs. They're defined using MQL (Metric Query Language) and can aggregate data from multiple sources.

### Anomalies
The ML platform continuously monitors metrics and detects statistical anomalies using an ensemble of Prophet, Isolation Forest, and LSTM models.

### Actions
When anomalies are detected, Actions (workflows) can automatically respond by posting to Slack, creating tickets, or triggering recovery procedures.

### Multi-Tenancy
Every resource is scoped to an Organization (tenant). Row-Level Security (RLS) ensures data isolation at the database level.

## Troubleshooting

**Issue: Docker services won't start**
```bash
docker compose down -v  # Remove volumes
docker compose up -d
```

**Issue: Database connection refused**
```bash
# Check if Postgres is running
docker compose ps postgres

# View logs
docker compose logs postgres
```

**Issue: API returns 401 Unauthorized**
```bash
# Check your token is valid
# Tokens expire after 24 hours by default
# Re-login to get a fresh token
```

**Issue: Frontend can't connect to API**
```bash
# Check NEXT_PUBLIC_API_URL in .env
# Should be http://localhost:8000
```

## Resources

- **API Documentation:** http://localhost:8000/docs
- **Architecture Blueprint:** [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment Guide:** [docs/DEPLOYMENT.md](./DEPLOYMENT.md)
- **ADRs:** [docs/adrs/](./adrs/)
- **Runbooks:** [docs/runbooks/](./runbooks/)

## Getting Help

- **GitHub Issues:** https://github.com/ayvlo/core/issues
- **Documentation:** https://docs.ayvlo.com
- **Discord:** https://discord.gg/ayvlo
- **Email:** support@ayvlo.com

## What's Next?

- [ ] Connect real data sources
- [ ] Set up production deployment
- [ ] Configure monitoring & alerts
- [ ] Customize ML model thresholds
- [ ] Build custom action workflows
- [ ] Integrate with your tools (Jira, PagerDuty, etc.)

Welcome to the Ayvlo community! 🚀
