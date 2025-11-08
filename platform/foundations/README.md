# Appkod Platform - Foundation Golden Bases

**Decision Date:** 2025-11-08
**Decision Owner:** Foundation Sourcing Agent (FSA)
**Average Score:** 0.86 / 1.0

## Overview

This directory contains the "golden bases" - vetted, scored, and documented foundation technologies for the Appkod platform. Each foundation has been evaluated using a standardized scorecard and represents the **best-in-class open-source solution** for its category.

## 9 Foundation Areas

| # | Area | Technology | Score | Status |
|---|------|-----------|-------|--------|
| 1 | **Auth/SSO** | [Keycloak](./auth-keycloak/) | 0.85 | ✅ Active |
| 2 | **Policy/ABAC** | [Open Policy Agent](./policy-opa/) | 0.86 | ✅ Active |
| 3 | **Database/ORM** | [PostgreSQL + Prisma + SQLModel](./database-postgres/) | 0.87 | ✅ Active |
| 4 | **Queues/Scheduling** | [Temporal](./queues-temporal/) | 0.83 | ✅ Active |
| 5 | **API Framework** | [FastAPI](./api-fastapi/) | 0.88 | ✅ Active |
| 6 | **UI Design System** | [Radix UI + shadcn/ui](./ui-radix/) | 0.84 | ✅ Active |
| 7 | **Infrastructure** | [Pulumi + ArgoCD](./infra-pulumi/) | 0.82 | ✅ Active |
| 8 | **Testing** | [Playwright + Vitest + Pact](./testing-playwright/) | 0.88 | ✅ Active |
| 9 | **Security** | [Trivy](./security-trivy/) | 0.91 ⭐ | ✅ Active |

## Scoring Methodology

Each foundation is evaluated on 6 dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Security** | 30% | CVE track record, security features, compliance |
| **Stability** | 25% | Maturity, breaking changes, LTS support |
| **Performance** | 15% | Throughput, latency, resource usage |
| **Integration Fit** | 15% | How well it fits our Next.js + FastAPI stack |
| **License** | 10% | OSI-approved, commercial-friendly (Apache 2.0, MIT preferred) |
| **Community** | 5% | GitHub stars, contributors, documentation quality |

**Minimum acceptable score:** 0.60 / 1.0

## Key Principles

### 1. EU-first / GDPR-by-design
- All foundations support EU hosting
- GDPR compliance built-in (audit logs, data minimization, right to be forgotten)
- Swedish/Nordic integrations prioritized

### 2. No Vendor Lock-in
- Only OSI-approved licenses (Apache 2.0, MIT, PostgreSQL License)
- Self-hosting options for all components
- Full data export capabilities

### 3. Multi-tenant from Day 1
- All foundations support multi-tenancy
- PostgreSQL RLS for data isolation
- Keycloak realms per tenant
- OPA policies per tenant

### 4. Type Safety
- TypeScript for frontend (Next.js)
- Python with Pydantic for backend (FastAPI)
- Zod schemas for contracts
- Prisma/SQLModel for type-safe DB access

## Critical Decisions

### Why Pulumi over Terraform?
**Terraform's BSL 1.1 license is NOT OSI-approved** and has commercial restrictions. Pulumi is Apache 2.0 and uses TypeScript/Python instead of HCL.

### Why OPA over OpenFGA?
OpenFGA had recent authorization bypass CVEs (CVE-2025-25196, CVE-2025-46331). OPA is CNCF graduated with better security track record.

### Why Keycloak over Auth0?
Auth0 is proprietary/expensive for multi-tenant. Keycloak is open-source, self-hosted, with native multi-tenant support (realms).

## Quick Start

Each foundation directory contains:
- **README.md** - Overview, rationale, integration examples
- **SCORECARD.md** - Detailed scoring breakdown (created as needed)
- **ALTERNATIVES.md** - Backup options if primary choice fails (created as needed)
- **docker-compose.yml** - Local development setup (where applicable)
- **integration/** - TypeScript + Python code examples (created as needed)

## Example: Getting Started with Auth

```bash
cd foundations/auth-keycloak
docker-compose up -d

# Access Keycloak at http://localhost:8080
# Default: admin / admin_dev_password
```

## Security

All foundations are monitored for CVEs using:
- **Trivy** for container/dependency scanning
- **Dependabot** for automated dependency updates
- **GitHub Security Advisories** for notifications

## License Compliance

All foundations use OSI-approved licenses:
- **Apache 2.0:** Keycloak, OPA, Temporal, Pulumi, ArgoCD, Trivy
- **MIT:** FastAPI, Radix UI, Playwright, Vitest, Pact, Prisma
- **PostgreSQL License:** PostgreSQL

**No GPL/AGPL** - incompatible with commercial use.

## Roadmap

### Phase 1 (Complete)
- ✅ Catalog mapping for 9 areas
- ✅ Scorecard evaluation
- ✅ Documentation (READMEs)

### Phase 2 (Next)
- Docker compose integration examples
- TypeScript + Python code samples
- Detailed scorecards (SCORECARD.md)
- Alternative analysis (ALTERNATIVES.md)

### Phase 3 (Future)
- Production deployment guides
- Performance benchmarks
- Cost analysis per component
- Migration guides from alternatives

## Contributing

Foundation updates must go through FSA review:
1. Propose change in `decision_log.md`
2. Re-run scorecard evaluation
3. Update foundation README
4. Get FSA approval

## Resources

- **Full Catalog:** `projects/appkodplattform/foundation_catalog.json`
- **FSA Specification:** `projects/appkodplattform/fsa_specification.json`
- **Decision Log:** `orchestration/decision_log.md`

---

**Last Updated:** 2025-11-08 (Session 2)
**Next Review:** 2025-12-08 (monthly cadence)
