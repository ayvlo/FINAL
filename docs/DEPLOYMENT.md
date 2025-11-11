# Ayvlo Deployment Guide

This guide walks through deploying Ayvlo from zero to production.

## Prerequisites

- **Infrastructure:**
  - Kubernetes cluster (EKS, GKE, or AKS) with 10+ nodes
  - PostgreSQL 16+ (RDS, Aurora, or Neon)
  - ClickHouse Cloud account
  - Redpanda Cloud account (or self-hosted Kafka)
  - Redis 7+ (ElastiCache or Upstash)
  - S3-compatible storage

- **Tools:**
  - `kubectl` 1.28+
  - `terraform` / `tofu` 1.6+
  - `helm` 3.12+
  - `argocd` CLI
  - `docker` 24+

- **Accounts:**
  - GitHub (CI/CD)
  - Auth0 or WorkOS (authentication)
  - Sentry (error tracking)
  - Grafana Cloud or self-hosted observability stack

## Deployment Steps

### 1. Infrastructure Provisioning (Terraform)

```bash
cd infra/terraform

# Initialize
terraform init

# Plan
terraform plan \
  -var="environment=production" \
  -var="region=us-east-1" \
  -out=tfplan

# Apply
terraform apply tfplan
```

### 2. Configure Secrets (Vault + External Secrets)

```bash
# Set up Vault
export VAULT_ADDR="https://vault.ayvlo.com"
vault login

# Write secrets
vault kv put secret/ayvlo/production \
  postgres_url="$POSTGRES_URL" \
  clickhouse_url="$CLICKHOUSE_URL" \
  redpanda_broker="$REDPANDA_BROKER" \
  openai_api_key="$OPENAI_API_KEY"

# Deploy External Secrets Operator
kubectl apply -f infra/k8s/external-secrets/
```

### 3. Deploy Core Services (Helm)

```bash
# Add Helm repo
helm repo add ayvlo https://charts.ayvlo.com
helm repo update

# Deploy infrastructure components
helm install openfga openfga/openfga -f infra/k8s/values/openfga-prod.yaml
helm install vault hashicorp/vault -f infra/k8s/values/vault-prod.yaml

# Deploy Ayvlo platform
helm install ayvlo ./infra/k8s/charts/ayvlo \
  -f infra/k8s/values/production.yaml \
  --namespace ayvlo \
  --create-namespace
```

### 4. Set Up GitOps (Argo CD)

```bash
# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Create application
argocd app create ayvlo \
  --repo https://github.com/ayvlo/core \
  --path infra/k8s/manifests \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace ayvlo \
  --sync-policy automated
```

### 5. Database Migrations

```bash
# Run migrations
kubectl run alembic --rm -it \
  --image=ayvlo/api-gateway:latest \
  --env POSTGRES_URL=$POSTGRES_URL \
  -- alembic upgrade head

# Verify
kubectl logs -l app=alembic
```

### 6. Deploy ML Platform (Ray + KServe)

```bash
# Install KServe
kubectl apply -f https://github.com/kserve/kserve/releases/download/v0.12.0/kserve.yaml

# Deploy Ray cluster
helm install ray-cluster kuberay/ray-cluster -f infra/k8s/values/ray-prod.yaml

# Deploy models
kubectl apply -f ml/serving/inference-services/
```

### 7. Configure Observability

```bash
# Deploy Prometheus + Grafana
helm install prometheus prometheus-community/kube-prometheus-stack \
  -f infra/observability/values/prometheus-prod.yaml

# Import dashboards
kubectl apply -f infra/observability/grafana/dashboards/

# Set up alerts
kubectl apply -f infra/observability/prometheus/alerts/
```

### 8. Verify Deployment

```bash
# Check all pods
kubectl get pods -n ayvlo

# Health checks
curl https://api.ayvlo.com/health

# View logs
kubectl logs -f -l app=api-gateway -n ayvlo
```

### 9. DNS & SSL

```bash
# Point DNS to LoadBalancer
kubectl get svc -n ayvlo ingress-nginx-controller

# Install cert-manager for SSL
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Apply certificates
kubectl apply -f infra/k8s/certificates/
```

### 10. Initial Configuration

```bash
# Create first organization
curl -X POST https://api.ayvlo.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@company.com", "org_name": "Acme Corp"}'

# Configure first metric
# Connect first data source
# Set up first workflow
```

## Post-Deployment

- [ ] Set up monitoring dashboards
- [ ] Configure alerting rules
- [ ] Test DR procedures
- [ ] Run load tests
- [ ] Document runbooks
- [ ] Train team on operations
- [ ] Schedule first chaos game day

## Rollback Procedure

```bash
# Rollback with Argo CD
argocd app rollback ayvlo

# Or with Helm
helm rollback ayvlo

# Verify
kubectl get pods -n ayvlo
```

## Disaster Recovery

See [DR Runbook](./runbooks/disaster-recovery.md) for complete procedures.

Quick recovery:

```bash
# 1. Restore database from PITR
# 2. Redeploy services
# 3. Verify data integrity
# 4. Update DNS if needed
```

## Scaling

- **Horizontal:** Increase replicas in `values/production.yaml`
- **Vertical:** Adjust resource requests/limits
- **Database:** Enable read replicas, connection pooling
- **Cache:** Redis cluster mode, more shards

## Security Checklist

- [ ] All secrets in Vault (no hardcoded)
- [ ] RLS enabled on all tables
- [ ] Network policies applied
- [ ] Image scanning passed
- [ ] RBAC configured
- [ ] Audit logging enabled
- [ ] mTLS between services
- [ ] WAF rules active

## Troubleshooting

**Issue: Pods crashing**
```bash
kubectl describe pod <pod-name> -n ayvlo
kubectl logs <pod-name> -n ayvlo --previous
```

**Issue: Database connection failing**
```bash
# Test connection
kubectl run psql --rm -it --image=postgres:16 -- psql $POSTGRES_URL
```

**Issue: High latency**
```bash
# Check metrics
kubectl port-forward svc/grafana 3000:80 -n monitoring
# Open http://localhost:3000
```

For more help, see [Runbooks](./runbooks/) or contact ops@ayvlo.com.
