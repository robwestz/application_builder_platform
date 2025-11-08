# Assumptions Log - Appkodplattform

> **Purpose:** Track all assumptions that need verification. This prevents building on unvalidated premises.
> **Usage:** Log immediately when assumption is made. Update status when verified/invalidated. Never delete.

**Format:**
```
## ASS-XXX: [Short description]
- **Date:** YYYY-MM-DD
- **Made by:** Role
- **Assumption:** What we're assuming
- **Why it matters:** Impact if wrong
- **Validation needed:** How to verify
- **Status:** [Unverified | Verified | Invalidated]
- **Verified date:** YYYY-MM-DD (if applicable)
- **Notes:** Additional context
```

---

## ASS-001: We can recruit/assign 10 agents simultaneously

- **Date:** 2025-11-08
- **Made by:** PM
- **Assumption:** We can get 10 agents (human or AI) assigned to this project simultaneously for Phase 0 and Phase 1.
- **Why it matters:** If we can only get 5 agents, timeline doubles. If we get 1 agent doing all roles sequentially, Phase 0 takes 6-8 weeks instead of 2 weeks.
- **Validation needed:** PM confirms team availability and assignment plan.
- **Status:** Unverified
- **Notes:** Critical for timeline estimates. If we can't get 10 parallel agents, we need to re-plan phases.

---

## ASS-002: Postgres with RLS is sufficient for multi-tenant isolation

- **Date:** 2025-11-08
- **Made by:** ARCH
- **Assumption:** Postgres Row-Level Security (RLS) provides sufficient tenant isolation for enterprise-grade multi-tenancy.
- **Why it matters:** If RLS is insufficient, we'd need schema-per-tenant (complex migrations) or separate DB-per-tenant (costly).
- **Validation needed:** FSA scorecard + SEC security review + proof-of-concept test (attempt to breach tenant isolation).
- **Status:** Unverified
- **Notes:** Alternative: schema-per-tenant or DB-per-tenant adds significant complexity but might be necessary for highest security requirements.

---

## ASS-003: Next.js + FastAPI is optimal starting stack

- **Date:** 2025-11-08
- **Made by:** ARCH
- **Assumption:** Next.js (frontend) + FastAPI (backend) is the best starting tech stack for codegen. Utbyggbart till andra stackar senare.
- **Why it matters:** If wrong choice, we'd need to rebuild codegen templates. Switching stacks mid-project is expensive.
- **Validation needed:** FSA scorecard for API/Framework and UI/Designsystem. Developer community feedback. Performance benchmarks.
- **Status:** Unverified
- **Notes:** Alternatives: Remix/Astro (frontend), NestJS/Hono (backend). Need to validate that Next.js + FastAPI covers majority of use cases (websites, SaaS, e-commerce, business apps).

---

## ASS-004: Blueprint/DSL in YAML/JSON is user-friendly enough

- **Date:** 2025-11-08
- **Made by:** ARCH
- **Assumption:** Users (technical and semi-technical) can work with Blueprint YAML/JSON spec, potentially via GUI Studio.
- **Why it matters:** If YAML/JSON is too complex, users won't adopt. If too simple, it won't express complex apps.
- **Validation needed:** User testing with target personas (developers, business analysts, entrepreneurs). GUI Studio usability testing.
- **Status:** Unverified
- **Notes:** GUI Studio mitigates this risk by providing visual editor, but YAML/JSON is the underlying format. Need to balance expressiveness vs simplicity.

---

## ASS-005: 8 connectors in v1 is sufficient for market validation

- **Date:** 2025-11-08
- **Made by:** ANALYST
- **Assumption:** Starting with 8 Swedish/EU connectors (BankID, Fortnox, Visma, Swish, Klarna, Stripe, e-sign, email/SMS) is enough to validate market fit.
- **Why it matters:** If wrong, we might miss critical connectors that are dealbreakers for target customers.
- **Validation needed:** Customer interviews, competitor analysis, market research.
- **Status:** Unverified
- **Notes:** Connector SDK allows adding more post-v1, but initial set needs to cover most common use cases for Swedish/EU market.

---

## ASS-006: Time-to-first-app < 30 minutes is achievable

- **Date:** 2025-11-08
- **Made by:** PM
- **Assumption:** User can go from idea → working app in < 30 minutes using conversational builder or Blueprint.
- **Why it matters:** Key differentiator vs traditional development (weeks/months). If takes hours, value prop weakens.
- **Validation needed:** Prototype testing, time trials with different app types (simple website, e-commerce, SaaS).
- **Status:** Unverified
- **Notes:** This assumes "working app" = MVP with basic features. Full production-ready app will take longer.

---

## ASS-007: EU hosting is a strong selling point for target market

- **Date:** 2025-11-08
- **Made by:** SEC
- **Assumption:** Swedish/EU companies will prefer EU-hosted solution over US-based competitors due to GDPR, data sovereignty, and trust.
- **Why it matters:** If wrong, EU hosting adds cost without value. Could use cheaper US cloud providers.
- **Validation needed:** Customer interviews, sales feedback, compliance team input from target companies (offentlig sektor, finans, hälsa).
- **Status:** Unverified
- **Notes:** Working hypothesis based on market trends (GDPR, Schrems II, data sovereignty concerns). Needs validation.

---

## ASS-008: Code export is a killer feature vs proprietary platforms

- **Date:** 2025-11-08
- **Made by:** PM
- **Assumption:** Ability to export generated code and run it independently is a major competitive advantage that will drive adoption.
- **Why it matters:** If customers don't care about code export, we're building complex feature with limited value.
- **Validation needed:** Customer interviews, survey target users, analyze churn reasons from proprietary platforms (Bubble, Webflow, etc.).
- **Status:** Unverified
- **Notes:** Theory: enterprises fear vendor lock-in. Exportable code = insurance policy. But do SMEs care? Needs validation.

---

## ASS-009: LLM costs per generated app will be under budget threshold

- **Date:** 2025-11-08
- **Made by:** OPS
- **Assumption:** LLM token costs for conversational builder → Blueprint → code generation will be economically viable (profitable unit economics).
- **Why it matters:** If LLM costs are too high, we can't offer competitive pricing or we operate at a loss.
- **Validation needed:** Prototype cost analysis, benchmark token usage for different app types, pricing model simulation.
- **Status:** Unverified
- **Notes:** Need to measure: tokens per conversation, tokens per codegen, caching strategies, cost per app type (simple website vs complex SaaS).

---

## ASS-010: Universal builder (VILKEN APP SOM HELST) is technically feasible

- **Date:** 2025-11-08
- **Made by:** ARCH
- **Assumption:** We can build a single platform that generates code for ALL application types (websites, e-commerce, SaaS, business apps, databases, etc.) without becoming unwieldy.
- **Why it matters:** If scope is too broad, platform becomes complex, buggy, and hard to maintain. Might need to specialize.
- **Validation needed:** Proof-of-concept for diverse app types, architecture review, scalability analysis.
- **Status:** Unverified
- **Notes:** Risk: "jack of all trades, master of none." Mitigation: Recipe marketplace allows specialization; core platform provides primitives (data, auth, UI, logic). Need to validate this architecture.

---

## Template for Future Assumptions

```markdown
## ASS-XXX: [Short description]

- **Date:** YYYY-MM-DD
- **Made by:** Role
- **Assumption:** What we're assuming
- **Why it matters:** Impact if wrong
- **Validation needed:** How to verify
- **Status:** Unverified
- **Notes:** Additional context
```

---

**Last updated:** 2025-11-08 by PM (session 1)
**Total assumptions:** 10
**Unverified:** 10
**Verified:** 0
**Invalidated:** 0

**Next verification sprint:** Sprint 0 (during Phase 0 execution)
