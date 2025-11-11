# ADR-002: PostgreSQL Row-Level Security for Multi-Tenancy

**Status:** Accepted
**Date:** 2025-01-11
**Deciders:** Platform Team

## Context

Ayvlo is a multi-tenant SaaS platform where each organization's data must be strictly isolated. We need a robust, database-level mechanism to prevent data leakage between tenants, even in the event of application bugs.

## Decision

We will use **PostgreSQL Row-Level Security (RLS)** as the primary multi-tenant isolation mechanism. Every table containing tenant data will have:

1. An `org_id` column (UUID)
2. RLS enabled
3. Policies enforcing `WHERE org_id = current_setting('app.current_org_id')`

Application code must call `set_rls_context(org_id, user_id)` at the start of each request to set the session variables.

## Consequences

**Positive:**
- **Security:** Database-level enforcement prevents data leakage
- **Defense in depth:** Works even if application logic has bugs
- **Audit:** All queries automatically scoped by RLS
- **Compliance:** Meets SOC 2 / ISO 27001 requirements
- **PostgreSQL native:** No additional frameworks needed

**Negative:**
- **Performance:** Slight overhead on every query (mitigated by indexes)
- **Complexity:** Developers must understand RLS semantics
- **Testing:** Integration tests must set RLS context
- **Migrations:** Schema changes must update policies

## Implementation Details

```sql
-- Enable RLS on table
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation_policy ON metrics
FOR ALL
USING (org_id = current_setting('app.current_org_id')::uuid);

-- Set context in application
SELECT set_rls_context('org-uuid', 'user-uuid');
```

## Alternatives Considered

### 1. Application-Level Filtering
**Rejected:** Too error-prone. Easy to forget WHERE clauses.

### 2. Schema-Per-Tenant
**Rejected:** Doesn't scale to 10k+ tenants. Schema proliferation issues.

### 3. Database-Per-Tenant
**Rejected:** Operational nightmare. Can't scale cost-effectively.

### 4. Citus Multi-Tenant
**Rejected:** Adds complexity. RLS is simpler for our scale.

## References

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Multi-Tenant Data Architecture](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/overview)
