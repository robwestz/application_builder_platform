# Appkod Platform - Universal Builder Monorepo

**"VEM SOM HELST kan bygga VILKEN APP SOM HELST"**

> AI-powered universal builder platform där vem som helst kan bygga websites, e-commerce, SaaS, business apps genom konversation. Enterprise-grade säkerhet, GDPR-first, full kod-export, ingen vendor lock-in.

## 🏗️ Monorepo Structure

```
platform/
├── packages/
│   ├── contracts/     # Shared types, schemas, and contracts (TypeScript + Zod)
│   ├── web/           # Next.js Builder Studio (UI)
│   ├── api/           # FastAPI backend (Python)
│   ├── runner/        # Serverless runtime for generated apps (Python)
│   ├── cli/           # CLI tool (gom/ctl) for scaffold, codegen, deploy
│   └── connectors/    # Connector SDK (BankID, Fortnox, Visma, Stripe, etc.)
├── infra/             # Infrastructure as Code (Pulumi), configs
├── tests/             # Integration and E2E tests
├── docs/              # Documentation
├── Makefile           # Main orchestration (make help)
└── docker-compose.yml # Local development environment
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.0.0
- **Python** >= 3.11
- **Docker** + Docker Compose
- **Make** (for command orchestration)

### Installation

```bash
# Install all dependencies (Node + Python)
make install

# Start all services via Docker
make docker-up

# Access services:
# - Web UI:      http://localhost:3000
# - API:         http://localhost:8000
# - API Docs:    http://localhost:8000/docs
# - Runner:      http://localhost:8001
# - Keycloak:    http://localhost:8080
# - Temporal UI: http://localhost:8082
```

### Development

```bash
# Show all available commands
make help

# Run validation (lint + typecheck + test)
make validate

# Start individual services
make dev-web    # Next.js web app
make dev-api    # FastAPI backend

# View logs
make docker-logs

# Stop services
make docker-down
```

## 📦 Packages

### @appkod/contracts

Shared contracts, types, and schemas using TypeScript + Zod. Single source of truth for data models.

**Key exports:**
- Blueprint schema (DSL for app definitions)
- User/Tenant schemas
- Connector contract interfaces

### @appkod/web

Next.js 15 web application - Builder Studio UI.

**Features:**
- Blueprint editor with real-time validation
- Component library (Radix UI + shadcn/ui)
- Preview environments
- Recipe marketplace

**Tech stack:** Next.js 15, React 19, Radix UI, Tailwind, Zustand

### @appkod/api

FastAPI backend for platform services.

**Responsibilities:**
- Blueprint validation and storage
- Codegen orchestration
- Connector management
- Tenant management
- Auth/authz integration (Keycloak + OPA)

**Tech stack:** FastAPI, SQLModel, Asyncpg, Temporal Python SDK

### @appkod/runner

Serverless runtime for executing generated applications.

**Features:**
- Multi-tenant isolation (RLS, per-tenant KMS)
- RBAC/ABAC enforcement
- Request routing per tenant
- Audit logging
- Cost tracking per tenant

**Tech stack:** FastAPI, SQLModel, Asyncpg, OPA client

### @appkod/cli

CLI tool (`appkod` / `gom`) for developers.

**Commands:**
```bash
appkod scaffold <app-name>     # Create new app from template
appkod generate                # Generate code from Blueprint
appkod validate blueprint.yml  # Validate Blueprint schema
appkod deploy                  # Deploy app to platform
appkod export                  # Export generated code
```

**Tech stack:** TypeScript, Commander, Inquirer, Handlebars

### @appkod/connectors

Connector SDK for Swedish/EU integrations.

**Phase 1 connectors (8):**
- BankID (Swedish e-ID)
- Fortnox (Swedish accounting)
- Visma (Nordic ERP/accounting)
- Swish (Swedish payments)
- Klarna (Nordic BNPL)
- Stripe (payments)
- E-sign (Scrive/Assently)
- Email/SMS gateways

**Tech stack:** TypeScript, Axios, Zod for contract validation

## 🏗️ Architecture

### Services

| Service | Port | Description |
|---------|------|-------------|
| Web (Next.js) | 3000 | Builder Studio UI |
| API (FastAPI) | 8000 | Platform backend |
| Runner (FastAPI) | 8001 | Generated app runtime |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache + sessions |
| Keycloak | 8080 | Auth/SSO (OIDC) |
| OPA | 8181 | Policy engine (ABAC) |
| Temporal | 7233 | Workflow orchestration |
| Temporal UI | 8082 | Workflow dashboard |

### Data Flow

```
User → Web UI → API → [Codegen Engine] → Generated Code
                  ↓
              Runner (multi-tenant) → Postgres (RLS) + OPA
```

## 🛠️ Development Workflow

### Local Development

```bash
# Start all services
make docker-up

# Work on web UI
cd packages/web
npm run dev

# Work on API
cd packages/api
source .venv/bin/activate
uvicorn main:app --reload

# Run tests
make test

# Lint and format
make lint
make format
```

### Blueprint Development

Create a `blueprint.yml`:

```yaml
version: "1.0"
name: "My CRM"
description: "Customer relationship management app"

database:
  tables:
    - name: customers
      fields:
        - {name: id, type: uuid, primary: true}
        - {name: name, type: string, required: true}
        - {name: email, type: email, unique: true}
        - {name: created_at, type: timestamp, default: now}

ui:
  pages:
    - path: /customers
      title: "Customers"
      components:
        - type: table
          source: customers
          columns: [name, email, created_at]

api:
  endpoints:
    - path: /api/customers
      method: GET
      table: customers
      auth: required
```

Validate and generate:

```bash
appkod validate blueprint.yml
appkod generate
```

## 🔒 Security

### Multi-tenant Isolation

- **Database:** Row-Level Security (RLS) per tenant
- **Auth:** Keycloak with org/team scopes
- **Policy:** OPA for ABAC/RBAC enforcement
- **Secrets:** Per-tenant KMS keys
- **Audit:** Structured logs (who, what, when, where, why)

### GDPR Compliance

- **Data minimization:** Blueprint validates data collection
- **Purpose limitation:** DPIA templates required
- **Right to be forgotten:** Auto-generated deletion endpoints
- **Data portability:** Export endpoints included
- **Audit logs:** Immutable, queryable

### Security Scanning

```bash
# Run Trivy security scan
make security-scan

# Check dependencies
npm audit
pip-audit

# Pre-commit hooks
pre-commit install
```

## 📊 Database Migrations

```bash
# Run migrations
make db-migrate

# Reset database (WARNING: deletes all data)
make db-reset
```

## 🧪 Testing

```bash
# Run all tests
make test

# Run specific package tests
cd packages/web && npm test
cd packages/api && pytest

# E2E tests with Playwright
cd tests/e2e && npm run test:e2e
```

## 📚 Documentation

- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **Architecture:** [docs/architecture.md](docs/architecture.md)
- **Blueprint DSL:** [docs/blueprint-spec.md](docs/blueprint-spec.md)
- **Connector SDK:** [docs/connector-sdk.md](docs/connector-sdk.md)

## 🎯 Phase 0 Goals

- ✅ Monorepo scaffold
- 🔄 Blueprint DSL specification
- 🔄 Core contracts definition
- 🔄 CLI bootstrap
- 🔄 Codegen v0.1 (basic CRUD)
- 🔄 Foundation golden bases (9 areas)

## 🌍 EU/GDPR First

- EU hosting (AWS Frankfurt, GCP Belgium)
- GDPR-by-design architecture
- Swedish/Nordic connector prioritization
- Data residency controls
- DPIA templates included

## 📄 License

UNLICENSED - Proprietary software for Appkod Platform Team

---

**Built with ❤️ for democratizing app development**
*"Precis som AI gör att icke-skribenter kan skriva, gör vi att icke-developers kan utveckla"*
