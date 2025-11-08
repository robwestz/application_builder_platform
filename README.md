# Application Builder Platform - Orkestreringsramverk

> **Enterprise-grade orchestration framework för multi-agent projekt**

Detta repo innehåller orkestreringsbaslinjen och projektdefinitioner för storskaliga, multi-agent driven mjukvaruutveckling. Fokus ligger på svensk/europeisk kontext med GDPR-first design, zero-trust säkerhet och full kod-äganderätt.

---

## 📋 Innehåll

- [Översikt](#översikt)
- [Struktur](#struktur)
- [Orchestration Baseline](#orchestration-baseline)
- [Projekt](#projekt)
  - [SERP Observatory (Exempel)](#serp-observatory-exempel)
  - [Appkodplattformen (Huvudprojekt)](#appkodplattformen-huvudprojekt)
- [Kom igång](#kom-igång)
- [Viktiga principer](#viktiga-principer)

---

## Översikt

Detta ramverk etablerar:

1. **Orchestration Baseline v1** - Minimikrav för alla projekt (governance, kvalitet, säkerhet, automation)
2. **10-agenters modell** - PM, ARCH, FSA, API, UI, OPS, QA, SEC, ANALYST, WR med tydliga handshakes
3. **Foundation Sourcing Agent (FSA)** - Obligatorisk roll för att välja och driftsätta open-source komponenter
4. **Projekt-templates** - Strukturerad approach från idé till leverans

### Baslinjen är liten - projekten är stora

⚠️ **Viktigt att förstå:** Orchestration Baseline är endast ~5-10% av total insats. Den etablerar:
- Governance (handshakes, DoR/DoD)
- Kvalitetsportar (test coverage, security scans)
- Automation core (scaffold, codegen, CI/CD)
- Roller och ansvar

**90%+ av arbetet** är projektspecifikt och växer till hundratusentals rader kod, data-artefakter, connectors, UI, dokumentation, etc.

---

## Struktur

```
application_builder_platform/
├── orchestration/                          # Baslinjen för alla projekt
│   ├── orchestration_baseline_v1.json     # Governance, roller, kvalitet, automation
│   └── pm_minimum_checklist_v1.json       # PM-krav för alla projekt
│
├── projects/                               # Individuella projekt
│   ├── serp_observatory/                  # Exempel: SERP-Intent API & Observatory
│   │   ├── idea_brief.json
│   │   ├── system_prompt.json
│   │   ├── project_prompt.json
│   │   ├── team_assembly.json
│   │   ├── task_dag.json
│   │   └── artifact_manifest.json
│   │
│   └── appkodplattform/                   # Huvudprojekt: Svensk Appkodplattform
│       ├── idea_brief.json                # Projektidé och värdeproposition
│       ├── system_prompt.json             # Regler, stil, säkerhet för agenter
│       ├── project_prompt.json            # Scope, constraints, deliverables, metrics
│       ├── team_assembly.json             # 10 agenter med roller och ansvar
│       ├── task_dag.json                  # Task DAG för Phase 0 + Phase 1
│       ├── artifact_manifest.json         # Filstruktur och artefakter
│       ├── fsa_specification.json         # FSA-specifikation (Foundation Sourcing Agent)
│       └── foundation_catalog.json        # Katalog över valda open-source komponenter
│
└── README.md                               # Denna fil
```

---

## Orchestration Baseline

### Governance

Alla projekt följer **6 handshakes**:

1. **PLAN** - PM + ägande roll definierar vad, varför, när
2. **SPEC** - ARCH + ägande roll definierar hur (kontrakt, API, schema)
3. **DRAFT** - Ägande roll implementerar
4. **REVIEW** - SEC + QA granskar; övriga kan ge input
5. **COMMIT** - PM godkänner; kod commitas
6. **RELEASE** - OPS deployer; WR uppdaterar changelog

### 10 Roller (Minimum)

| Rol | Ansvar |
|-----|--------|
| **PM** | Mål, prioritering, budget, beslutslogg |
| **ARCH** | Systemdesign, kontrakt, repo-struktur |
| **FSA** | Foundation sourcing (välj open-source komponenter) |
| **FETCH** | Datakällor, normalisering, ToS-compliance *(vissa projekt)* |
| **ANALYST** | Intent/feature-syntes, datalogik, recipes |
| **API** | Backend/API, OpenAPI, stabilitet |
| **UI** | Frontend/UX, exports, Storybook |
| **WR** | Dokumentation, GTM-material |
| **QA** | Test, kontrakt, compliance |
| **OPS** | CI/CD, secrets, observability |
| **SEC** | Säkerhet, GDPR/DPIA, ToS-granskning |

**OBS:** FETCH används i vissa projekt (ex. SERP Observatory) men inte alla. Appkodplattformen använder FSA istället.

### Kvalitetsportar

- ✅ Kontrakt valideras (JSON Schema)
- ✅ OpenAPI lintad (om API)
- ✅ Test coverage >= 70% (unit + contract + e2e)
- ✅ Security checklist signerad
- ✅ Evidence log (source_id, timestamp, provider för data)

### Automation Core

- **Scaffold**: Monorepo, packages (core-contracts, pipelines, services-api, ui-app, infra, tests, docs)
- **Codegen**: `*.schema.json` → TypeScript types + Pydantic modeller
- **CI/CD**: lint → unit → contract → build → e2e → release
- **CLI**: `gom init`, `gom generate contracts`, `gom run sprint0`

---

## Projekt

### SERP Observatory (Exempel)

**Syfte:** Demonstrera hur Orchestration Baseline används för ett projekt.

**Idé:** SERP-Intent API & Observatory - analysera sök-intent, arketyper, required subtopics med legal datapipeline.

**Team:** 10 agenter (PM, ARCH, FETCH, ANALYST, API, UI, WR, QA, OPS, SEC)

**Deliverables:**
- OpenAPI med `/serp` och `/intent` endpoints
- Intent-klassning med confidence
- GUI för trend, arketypmix, export (JSON/CSV)

**Scope:** Provider-abstraktion, normalisering, intent-syntes, API, GUI.

Se `projects/serp_observatory/` för fullständiga JSON-filer.

---

### Appkodplattformen (Huvudprojekt)

**Syfte:** Bli först i Sverige med enterprise-grade conversational builder + code export plattform.

**Vision:** Svensk/EU-fokuserad no-code/low-code plattform där:
- Användare konverserar → Blueprint (YAML/JSON) → fullständig appkod (Next.js + FastAPI)
- Kunden kan exportera kod och köra själv (ingen vendor lock-in)
- Inbyggda svenska/EU-connectors (BankID, Fortnox, Visma, Swish, Klarna, etc.)
- Multi-tenant serverless runtime med zero-trust säkerhet
- GDPR-by-design från dag 1

**Inte en MVP** - Enterprise-grade från start:
- OIDC/OAuth2, RBAC/ABAC, RLS, per-tenant KMS
- Observability: logs, metrics, traces, cost tracking per tenant
- SBOM, supply chain scanning, DPIA-mallar
- Reproducible builds, canary deploys, rollback

**Team:** 10 agenter (PM, ARCH, **FSA**, API, UI, OPS, QA, SEC, ANALYST, WR)

**Foundation Sourcing Agent (FSA) - Obligatorisk**

FSA är kritisk för detta projekt. Mandatet:
- Kartlägga open-source komponenter för 9 områden (Auth, Policy, DB, Queues, API, UI, Infra, Testing, Security)
- Köra adoption scorecard (security, stability, performance, license, etc.)
- Välja top-kandidat per område (score >= 0.6)
- Skapa "golden bases" med docker-compose, config, integration patterns
- Underhålla `foundation_catalog.json` med versioner, CVE-monitoring, succession plans

**9 Catalog Areas:**
1. Auth/SSO (OIDC) - ex: Keycloak, Ory, Zitadel
2. Policy/ABAC - ex: OpenFGA, OPA, Cedar
3. DB/ORM (Postgres + RLS) - ex: Prisma, Drizzle, SQLModel
4. Queues/Scheduling - ex: Temporal, BullMQ, Celery
5. API/Framework - ex: FastAPI, NestJS
6. UI/Designsystem - ex: Radix, shadcn/ui, Chakra
7. Infra (IaC) - ex: Terraform, Pulumi, ArgoCD
8. Testing - ex: Playwright, Pact, Vitest, pytest
9. Security - ex: Trivy, Syft/Grype, Sigstore

**Phases:**

- **Phase 0:** Scaffold + Contracts + CLI + minimal Blueprint parser
- **Phase 1:** Codegen v1 + Runner + 4 connectors + Auth/Policy + GUI Studio beta
- **Phase 2:** Observability + Market + 8 connectors total + SBOM + Compliance
- **Phase 3:** Enterprise (SSO, org-scopes, cost controls), 20+ recipes, export pipelines

**Success Metrics (Phase 1):**
- API latency p50 < 300ms, p95 < 900ms
- Builder → preview < 60s (p90)
- Test coverage >= 70%
- Zero tenant isolation incidents
- Time-to-first-app < 30 min
- 20+ recipes månad 1

Se `projects/appkodplattform/` för fullständiga specifikationer.

---

## Kom igång

### 1. Förstå strukturen

Läs:
- `orchestration/orchestration_baseline_v1.json` - baslinjen
- `orchestration/pm_minimum_checklist_v1.json` - PM-krav
- `projects/appkodplattform/project_prompt.json` - projektscope

### 2. Välj projekt

För Appkodplattformen:
```bash
cd projects/appkodplattform
cat idea_brief.json
cat team_assembly.json
cat task_dag.json
```

### 3. Sprint 0 Kickoff (för PM + team)

**PM:**
1. Skapa decision log och assumptions.md
2. Sätt budget (LLM tokens, cloud costs)
3. Definiera Sprint 0 mål

**FSA:**
1. Kartlägg alla 9 catalog areas
2. Kör scorecard på top-kandidater
3. Välj komponenter (score >= 0.6)
4. Skapa golden bases i `foundations/{area}/`

**ARCH:**
1. Skapa monorepo scaffold
2. Definiera Blueprint DSL (JSON Schema)
3. Skapa core contracts (User, Tenant, App, etc.)
4. Sätt upp CODEOWNERS

**OPS:**
1. CI pipeline (lint + unit + contract)
2. Docker-compose för lokal dev
3. Secrets management (vault setup)

**Övriga:**
- QA: Test strategy
- SEC: Security checklist template
- WR: Docs scaffold
- API/UI: Väntar på contracts + FSA golden bases

### 4. Handshakes

Varje task följer:
1. **PLAN** (PM + owner) → dokumentera vad + varför
2. **SPEC** (ARCH + owner) → kontrakt, API, schema
3. **DRAFT** (owner) → implementera
4. **REVIEW** (SEC + QA + team) → granska
5. **COMMIT** (PM godkänner) → merge
6. **RELEASE** (OPS) → deploy

---

## Viktiga principer

### 1. Evidens över antaganden
- Logga alla datakällor med `source_id`, `timestamp`, `provider`
- Dokumentera antaganden i `assumptions.md`
- Verifiera i REVIEW-fasen

### 2. Säkerhet från dag 1
- Zero-trust: OIDC, RLS, per-tenant KMS
- GDPR-by-design: dataminimering, right-to-be-forgotten
- ToS-compliance: inga otillåtna integrations
- Audit logs: who, what, when, where, why

### 3. Kvalitet som blocker
- Test coverage >= 70%
- Kontraktstester måste passa
- Security findings blockerar release
- SLO-regression failar build

### 4. Automatisering = snabbare leverans
- Codegen spar hundratals timmar
- CI/CD = snabbare feedback loops
- Infrastructure-as-code = reproducible
- Observability = proaktiv felsökning

### 5. FSA förhindrar "reinvent the wheel"
- Använd battle-tested open-source
- Scorecard säkerställer kvalitet
- Golden bases = snabbare integration
- CVE monitoring = proaktiv säkerhet

### 6. Öppenhet och äganderätt
- Kunden äger alltid sin kod
- Export-funktionalitet från dag 1
- SBOM för transparens
- Ingen vendor lock-in

### 7. Transparent om scope
- Baslinjen är ~5-10% av insats
- Projekten växer till hundratusentals LOC
- Kommunicera detta tydligt till stakeholders

---

## Nästa steg

### För Appkodplattformen:

1. **Sprint 0 (vecka 1-2):**
   - FSA: Välj komponenter för alla 9 areas
   - ARCH: Scaffold + Blueprint DSL + Contracts
   - OPS: CI pipeline
   - Team: Golden bases integration

2. **Phase 1 (vecka 3-8):**
   - Auth/Policy integration
   - Codegen v1 (Blueprint → Next.js + FastAPI)
   - 4 connectors (BankID, Fortnox, Stripe, Notion)
   - GUI Studio beta
   - Tests (coverage >= 70%)
   - Security audit
   - Staging deploy

3. **Phase 2-3 (vecka 9+):**
   - 8 connectors total
   - Recipe marketplace
   - Observability dashboards
   - Enterprise features (SSO, cost controls)
   - Production deploy

---

## Bidra

Detta är ett internt ramverk. För frågor eller ändringar:
1. Skapa issue i repo
2. Diskutera med PM + ARCH
3. Följ handshake-processen (PLAN → SPEC → DRAFT → REVIEW → COMMIT)

---

## Licens

Proprietär - internt bruk endast.

---

## Kontakt

**PM:** Se `projects/{project}/team_assembly.json` för projektspecifik kontakt.

**Frågor om Orchestration Baseline:** Kontakta ARCH-rollen för ditt projekt.

---

**Skapad:** 2025-11-08
**Version:** 1.0.0
**Senast uppdaterad:** 2025-11-08
