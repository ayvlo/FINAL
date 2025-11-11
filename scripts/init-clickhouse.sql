-- Initialize ClickHouse for Ayvlo OLAP workloads

-- Create database
CREATE DATABASE IF NOT EXISTS ayvlo;

-- Time-series events table (partitioned by day)
CREATE TABLE IF NOT EXISTS ayvlo.timeseries (
    org_id UUID,
    metric_id UUID,
    ts DateTime64(3, 'UTC'),
    value Float64,
    dimensions Map(String, String),
    metadata String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(ts)
ORDER BY (org_id, metric_id, ts)
TTL ts + INTERVAL 180 DAY
SETTINGS index_granularity = 8192;

-- Aggregated metrics (1-minute windows)
CREATE MATERIALIZED VIEW IF NOT EXISTS ayvlo.timeseries_1m
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMMDD(ts)
ORDER BY (org_id, metric_id, window_start)
AS SELECT
    org_id,
    metric_id,
    toStartOfMinute(ts) AS window_start,
    count() AS count,
    avg(value) AS avg_value,
    min(value) AS min_value,
    max(value) AS max_value,
    sum(value) AS sum_value,
    quantile(0.50)(value) AS p50,
    quantile(0.95)(value) AS p95,
    quantile(0.99)(value) AS p99
FROM ayvlo.timeseries
GROUP BY org_id, metric_id, window_start;

-- Aggregated metrics (1-hour windows)
CREATE MATERIALIZED VIEW IF NOT EXISTS ayvlo.timeseries_1h
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMMDD(window_start)
ORDER BY (org_id, metric_id, window_start)
AS SELECT
    org_id,
    metric_id,
    toStartOfHour(ts) AS window_start,
    count() AS count,
    avg(value) AS avg_value,
    min(value) AS min_value,
    max(value) AS max_value,
    sum(value) AS sum_value,
    quantile(0.50)(value) AS p50,
    quantile(0.95)(value) AS p95,
    quantile(0.99)(value) AS p99
FROM ayvlo.timeseries
GROUP BY org_id, metric_id, window_start;

-- Audit logs table (append-only, partitioned by day)
CREATE TABLE IF NOT EXISTS ayvlo.audit_logs (
    id UInt64,
    org_id UUID,
    actor String,
    action String,
    target String,
    meta String,
    ip_address String,
    user_agent String,
    at DateTime64(3, 'UTC')
)
ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(at)
ORDER BY (org_id, at, id)
TTL at + INTERVAL 365 DAY
SETTINGS index_granularity = 8192;

-- Event stream table (high-volume ingestion)
CREATE TABLE IF NOT EXISTS ayvlo.events (
    id UInt64,
    org_id UUID,
    topic String,
    payload String,
    ts DateTime64(3, 'UTC'),
    metadata String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(ts)
ORDER BY (org_id, topic, ts)
TTL ts + INTERVAL 90 DAY
SETTINGS index_granularity = 8192;

-- Create indexes for better query performance
ALTER TABLE ayvlo.timeseries ADD INDEX idx_metric_id metric_id TYPE bloom_filter GRANULARITY 1;
ALTER TABLE ayvlo.events ADD INDEX idx_topic topic TYPE bloom_filter GRANULARITY 1;
