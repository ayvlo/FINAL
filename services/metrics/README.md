# Ayvlo Metrics Service

High-performance metrics ingestion and querying service using FastAPI and ClickHouse.

## Features

- **High-throughput ingestion**: Batch processing with 1000+ metrics/second
- **ClickHouse storage**: Columnar OLAP database optimized for time-series
- **Automatic aggregation**: Pre-computed hourly rollups for fast queries
- **Multi-tenancy**: Row-level tenant isolation
- **Rate limiting**: Redis-backed rate limiting per tenant
- **Observability**: Prometheus metrics, structured logging

## Tech Stack

- **Framework**: FastAPI 0.115+
- **Language**: Python 3.12+
- **Database**: ClickHouse (time-series), PostgreSQL (metadata)
- **Cache**: Redis
- **Metrics**: Prometheus
- **Logging**: structlog

## Getting Started

```bash
# Install dependencies
poetry install

# Run development server
poetry run uvicorn app.main:app --reload --port 8001

# Run tests
poetry run pytest

# Lint
poetry run ruff check .
poetry run black .
```

## API Endpoints

### Ingestion

#### Single Metric
```bash
POST /api/v1/metrics/ingest
Headers:
  X-Tenant-ID: <tenant-uuid>
Body:
{
  "metric_name": "revenue",
  "value": 1250.50,
  "timestamp": "2025-01-15T10:30:00Z",
  "dimensions": {"region": "us-west", "plan": "pro"},
  "metadata": {"source": "stripe"}
}
```

#### Batch Metrics
```bash
POST /api/v1/metrics/ingest/batch
Headers:
  X-Tenant-ID: <tenant-uuid>
Body:
{
  "metrics": [
    {"metric_name": "signups", "value": 12, "timestamp": "2025-01-15T10:30:00Z"},
    {"metric_name": "revenue", "value": 5000, "timestamp": "2025-01-15T10:30:00Z"}
  ]
}
```

### Querying

#### Raw Metrics
```bash
POST /api/v1/metrics/query
Headers:
  X-Tenant-ID: <tenant-uuid>
Body:
{
  "metric_name": "revenue",
  "start_time": "2025-01-01T00:00:00Z",
  "end_time": "2025-01-15T23:59:59Z",
  "dimensions": {"region": "us-west"},
  "aggregate": false
}
```

#### Aggregated Metrics
```bash
POST /api/v1/metrics/query
Body:
{
  "metric_name": "revenue",
  "start_time": "2025-01-01T00:00:00Z",
  "end_time": "2025-01-15T23:59:59Z",
  "aggregate": true
}
```

Returns hourly aggregates: count, avg, min, max, p50, p95, p99

### Health Checks

```bash
GET /health          # Basic health
GET /health/ready    # Readiness (checks ClickHouse + Redis)
GET /health/live     # Liveness
GET /metrics         # Prometheus metrics
```

## Environment Variables

```bash
# Service
ENVIRONMENT=development
DEBUG=true

# ClickHouse
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DATABASE=ayvlo

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=ayvlo
POSTGRES_PASSWORD=ayvlo
POSTGRES_DB=ayvlo

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# Rate Limiting
RATE_LIMIT_INGESTION=1000  # per minute
RATE_LIMIT_QUERY=100       # per minute

# Batch Processing
BATCH_SIZE=1000
BATCH_TIMEOUT_SECONDS=5
```

## Schema

### Metrics Table (ClickHouse)

```sql
CREATE TABLE metrics (
    tenant_id UUID,
    metric_id UUID,
    metric_name String,
    timestamp DateTime64(3),
    value Float64,
    dimensions Map(String, String),
    metadata Map(String, String),
    created_at DateTime64(3)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (tenant_id, metric_name, timestamp)
TTL timestamp + INTERVAL 90 DAY
```

### Aggregated Metrics (Materialized View)

```sql
CREATE TABLE metrics_hourly (
    tenant_id UUID,
    metric_name String,
    timestamp DateTime,
    count UInt64,
    sum Float64,
    avg Float64,
    min Float64,
    max Float64,
    p50 Float64,
    p95 Float64,
    p99 Float64
) ENGINE = SummingMergeTree()
```

## Performance

- **Ingestion**: 1000+ metrics/second per tenant
- **Query latency**: < 100ms for hourly aggregates (30-day range)
- **Storage efficiency**: 90-day TTL with automatic partition pruning
- **Compression ratio**: ~10x with ClickHouse columnar storage

## Deployment

```bash
# Docker build
docker build -t ayvlo-metrics:latest .

# Docker run
docker run -p 8001:8001 \
  -e CLICKHOUSE_HOST=clickhouse \
  -e REDIS_HOST=redis \
  ayvlo-metrics:latest
```

## Monitoring

Prometheus metrics available at `/metrics`:

- `http_requests_total`: Total HTTP requests
- `http_request_duration_seconds`: Request latency histogram
- `metrics_ingested_total`: Total metrics ingested
- `metrics_query_duration_seconds`: Query latency

## License

Copyright © 2025 Ayvlo Inc.
