# 🧠 Ayvlo — Autonomous Business Intelligence & Action Platform

> **Less noise. More vision.**  
> Ayvlo is an AI-powered SaaS platform that detects, explains, and acts on business anomalies — automatically.  
> It connects to your data stack (Stripe, HubSpot, etc.), monitors key metrics, and triggers recovery or optimization workflows before issues become revenue leaks.

---

## 🚀 Overview

Ayvlo is built to become the **autonomous intelligence layer** for modern businesses.

| Phase | Description |
|-------|--------------|
| **Phase 1** | Foundation & Validation – customer interviews, ICP, problem fit |
| **Phase 2** | MVP – anomaly detection + Slack alerts + Stripe recovery |
| **Phase 3** | Beta – real-time causal explanations, autonomous actions |
| **Phase 4** | Scale – enterprise readiness, multi-tenant orchestration, ML retraining loops |

---

## 🧩 Tech Stack (2025)

**Frontend**
- [Next.js 15](https://nextjs.org/) + React 19 + TypeScript 5  
- Tailwind CSS + shadcn/ui  
- TanStack Query + Zustand  
- Auth via Auth0 / WorkOS (OIDC + SAML + SCIM)  
- Deployed on **Vercel** + Cloudflare DNS/WAF  

**Backend / API**
- [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)  
- Async workers: Celery 6 + Redis 7  
- Event streaming: **Redpanda / Kafka**  
- OLTP: PostgreSQL 16 (+ pgvector)  
- OLAP: ClickHouse Cloud  
- ETL/Transform: Apache Airflow + dbt  
- ML: Ray + KServe + MLflow + Feast  
- Infra: Kubernetes (EKS/GKE) + Argo CD + Terraform/OpenTofu  
- Observability: OpenTelemetry → Prometheus / Grafana / Loki / Tempo / Sentry  

---

## 🏗️ Architecture

```
Integrations (Stripe, HubSpot, GA4)
        │
        ▼
 [Redpanda → Flink/Materialize]
        │
        ▼
Postgres (OLTP) ── ClickHouse (OLAP)
        │
        ▼
   FastAPI  ←→  gRPC microservices
        │
        ▼
   ML Platform (Ray + KServe)
        │
        ▼
Action Engine (Slack, Stripe, HubSpot)
        │
        ▼
   Next.js Dashboard (Vercel)
```

**Core Loop:** `Detect → Explain → Act`  
Every event ingested creates feedback for the ML ensemble (Prophet + Isolation Forest + LSTM), causal inference, and downstream automation.

---

## 🧰 Local Development

### Prerequisites
- Python 3.12+
- Node 20+
- Docker / Docker Compose
- Make or GNU make

### Quick Start

```bash
# 1️⃣  Clone & enter
git clone https://github.com/ayvlo/core.git
cd core

# 2️⃣  Start local services
docker compose up -d

# 3️⃣  Initialize database
alembic upgrade head

# 4️⃣  Run backend
uvicorn app.main:app --reload

# 5️⃣  Run frontend
cd apps/web && npm install && npm run dev

# 6️⃣  Visit
http://localhost:3000
```

### Environment Variables
Copy `.env.example` → `.env` and fill in credentials:

```
POSTGRES_URL=postgresql://user:pass@localhost:5432/ayvlo
REDPANDA_BROKER=localhost:9092
OPENAI_API_KEY=sk-...
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=
AUTH0_CLIENT_ID=
AUTH0_SECRET=
```

---

## 🔐 Security & Compliance

- Multi-tenant isolation with RLS + per-tenant KMS keys  
- OpenFGA for fine-grained authorization  
- Secrets managed via Vault + External Secrets Operator  
- SOC 2 / ISO 27001-ready controls  
- PII tokenization + field-level encryption  

---

## 📊 Observability

- **Metrics:** Prometheus + Grafana dashboards  
- **Logs:** Loki + Sentry  
- **Traces:** Tempo (OpenTelemetry)  
- **Alerts:** PagerDuty via Alertmanager  

Monitor the “four golden signals”: latency, traffic, errors, saturation.

---

## 🧠 MLOps Lifecycle

1. **Feature engineering** with dbt + Feast  
2. **Training** in Ray clusters (offline backtests)  
3. **Model tracking** in MLflow (S3 artifacts)  
4. **Serving** with KServe + vLLM  
5. **Evaluation** using TruLens/Ragas metrics  
6. **Promotion** through shadow → canary → full rollout  

---

## 🧪 Testing

```bash
pytest -m "not integration"
pytest -m "integration"  # full stack with docker
```

- Unit → Integration → E2E via Playwright  
- Contract tests with Buf/Pact  
- Coverage reports published to CI

---

## 🔄 CI / CD

- GitHub Actions → Argo CD (GitOps)
- Argo Rollouts for canary deployments
- Signed images (Cosign) + SBOMs (Syft)
- IaC scanning (Checkov) + SAST (Semgrep)

---

## 🧩 Feature Flags & Experiments

- GrowthBook / Flagsmith integrated via OpenFeature  
- CUPED-based A/B testing framework  
- Canary + dark-launch pipelines for safe iteration  

---

## 🧱 Repository Structure

```
ayvlo/
├─ apps/            # web, api-gateway, worker
├─ services/        # ingestion, metrics, anomalies, actions, authz, audit
├─ ml/              # training, serving, features, eval
├─ data/            # dbt, airflow
├─ infra/           # terraform, k8s, policies
├─ packages/        # shared proto + common libs
├─ .github/         # CI workflows
└─ docs/            # architecture & ADRs
```

---

## 🧑‍💻 Contributing

We welcome early contributors!

1. Fork + branch from `main`  
2. Follow conventional commits (`feat:`, `fix:`, `chore:`)  
3. Run `make test` before PR  
4. Open pull request → CI must pass → review → merge  

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for detailed guidelines.

---

## 🗺️ Roadmap

- [ ] Real-time causal inference (EconML/DoWhy)
- [ ] Multi-tenant analytics lake (ClickHouse + Iceberg)
- [ ] Auto-generated explanations via GPT-4o
- [ ] Enterprise SSO + audit pipeline
- [ ] SDKs for TypeScript, Python, Go

---

## 📜 License

Copyright © 2025 Ayvlo Inc.  
Released under the [MIT License](LICENSE).

---

### 💡 “Detect → Explain → Act”
> Every metric tells a story. Ayvlo listens — and acts.
