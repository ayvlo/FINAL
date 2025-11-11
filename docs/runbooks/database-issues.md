# Runbook: Database Issues

**Severity:** Critical
**On-Call:** Platform Team
**Slack:** #incidents

## Symptoms

- API returns `500 Internal Server Error`
- Logs show `connection refused` or `timeout`
- High database CPU/memory usage
- Slow query alerts firing
- RLS context errors

## Quick Diagnosis

```bash
# Check database health
kubectl exec -it postgres-0 -- psql -U ayvlo -c "SELECT 1"

# Check connections
kubectl exec -it postgres-0 -- psql -U ayvlo -c \
  "SELECT count(*) FROM pg_stat_activity"

# Check slow queries
kubectl exec -it postgres-0 -- psql -U ayvlo -c \
  "SELECT query, state, wait_event FROM pg_stat_activity WHERE state != 'idle'"
```

## Common Issues

### 1. Connection Pool Exhausted

**Symptoms:**
- `FATAL: remaining connection slots are reserved`
- High connection count

**Fix:**
```bash
# Check current connections
SELECT count(*) FROM pg_stat_activity;

# Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < now() - interval '5 minutes';

# Long-term: increase max_connections or add pgBouncer
```

### 2. Slow Queries

**Symptoms:**
- API timeout errors
- High database CPU

**Fix:**
```bash
# Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

# Check missing indexes
SELECT * FROM pg_stat_user_tables
WHERE idx_scan = 0 AND seq_scan > 1000;

# Add index
CREATE INDEX CONCURRENTLY idx_name ON table(column);
```

### 3. RLS Policy Errors

**Symptoms:**
- `ERROR: unrecognized configuration parameter "app.current_org_id"`
- Users seeing wrong data

**Fix:**
```bash
# Verify RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

# Check policies
\dp+ metrics

# Verify context being set
# Should be done in application code:
SELECT set_rls_context('org-uuid', 'user-uuid');
```

### 4. High Replication Lag

**Symptoms:**
- Stale data on read replicas
- Monitoring alerts

**Fix:**
```bash
# Check lag
SELECT
    client_addr,
    state,
    pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes
FROM pg_stat_replication;

# If lag > 10MB, investigate:
# - Network issues
# - Replica resource constraints
# - Long-running transactions
```

### 5. Disk Space Full

**Symptoms:**
- `ERROR: could not extend file`
- Monitoring alerts

**Fix:**
```bash
# Check disk usage
df -h

# Find largest tables
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

# Clean up old data
VACUUM FULL;  # Caution: locks table

# Or truncate old partitions
DROP TABLE events_2023_01_01;  # If partitioned
```

## Escalation

If issue persists after 15 minutes:

1. **Page on-call engineer:** `@oncall-platform` in Slack
2. **Create incident:** `/incident create Database Down`
3. **Notify stakeholders:** Post in #incidents
4. **Consider failover:** If primary down, promote replica

```bash
# Failover to replica (DESTRUCTIVE)
pg_ctl promote -D /var/lib/postgresql/data
```

## Prevention

- [ ] Set up connection pooling (pgBouncer)
- [ ] Add query timeout limits
- [ ] Create indexes for common queries
- [ ] Set up table partitioning for large tables
- [ ] Configure auto-vacuum properly
- [ ] Monitor replication lag
- [ ] Set up disk space alerts

## Monitoring Queries

```sql
-- Active connections by state
SELECT state, count(*) FROM pg_stat_activity GROUP BY state;

-- Long-running queries (> 5 min)
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
AND now() - query_start > interval '5 minutes';

-- Table sizes
SELECT
    schemaname || '.' || tablename AS table,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT
    schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

## Related Runbooks

- [High Latency](./high-latency.md)
- [Disaster Recovery](./disaster-recovery.md)
- [Scaling Database](./scaling-database.md)
