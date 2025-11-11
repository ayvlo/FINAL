# ADR-004: ClickHouse for OLAP and Time-Series

**Status:** Accepted
**Date:** 2025-01-11
**Deciders:** Data Platform Team

## Context

Ayvlo needs to:
- Store billions of time-series data points (metrics, events)
- Query large time windows efficiently (p95 < 250ms)
- Aggregate data across multiple dimensions
- Support audit logs with long retention
- Scale to 10M events/day

We need an OLAP database optimized for analytical queries.

## Decision

We will use **ClickHouse** as our primary OLAP and time-series database alongside PostgreSQL (OLTP).

## Consequences

**Positive:**
- **Performance:** 100-1000x faster than PostgreSQL for analytics
- **Compression:** 10x better than PostgreSQL (saves $$$)
- **Scalability:** Handles billions of rows easily
- **Materialized views:** Pre-aggregate common queries
- **SQL:** Familiar syntax, easy to learn
- **Open source:** Apache 2.0 license, active development
- **Cloud:** ClickHouse Cloud available, or self-host

**Negative:**
- **Not ACID:** Eventually consistent replication
- **No updates:** Designed for append-only (use ReplacingMergeTree)
- **Learning curve:** Different mental model than OLTP
- **Cost:** Can be expensive at high scale (mitigated by compression)
- **Another DB:** Operational overhead of second database

## Use Cases

| Use Case | Database | Reason |
|----------|----------|--------|
| User accounts | PostgreSQL | OLTP, ACID, RLS |
| Metric definitions | PostgreSQL | OLTP, relationships |
| Time-series data | ClickHouse | OLAP, high volume |
| Audit logs | ClickHouse | Append-only, retention |
| Event stream | ClickHouse | Real-time ingestion |
| Aggregations | ClickHouse | Analytical queries |

## Schema Design

```sql
-- Raw events (high cardinality)
CREATE TABLE events (
    org_id UUID,
    metric_id UUID,
    ts DateTime64(3),
    value Float64
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(ts)
ORDER BY (org_id, metric_id, ts);

-- Pre-aggregated (1-hour windows)
CREATE MATERIALIZED VIEW events_1h
ENGINE = SummingMergeTree()
AS SELECT
    org_id, metric_id,
    toStartOfHour(ts) AS hour,
    avg(value), min(value), max(value)
FROM events
GROUP BY org_id, metric_id, hour;
```

## Alternatives Considered

### TimescaleDB
**Rejected:** Good for time-series, but not as fast for analytics. PostgreSQL extension.

### Apache Druid
**Rejected:** More complex. Designed for real-time, not batch.

### Amazon Timestream
**Rejected:** Vendor lock-in. Not SQL-compatible.

### PostgreSQL with TimescaleDB
**Rejected:** Doesn't scale to billions of rows cost-effectively.

### Snowflake
**Rejected:** $$$$. Overkill for our scale.

## References

- [ClickHouse Benchmarks](https://benchmark.clickhouse.com/)
- [ClickHouse vs TimescaleDB](https://altinity.com/blog/clickhouse-vs-timescaledb)
- [ClickHouse for Time-Series](https://clickhouse.com/docs/en/guides/developer/time-series)
