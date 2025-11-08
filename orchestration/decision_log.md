# Decision Log - Appkodplattform

> **Purpose:** Log all significant decisions with context and rationale. This is the source of truth for "why we did X".
> **Usage:** Append new decisions chronologically. Never delete. Mark superseded decisions with [SUPERSEDED] tag.

**Format:**
```
## DEC-XXX: [Short title]
- **Date:** YYYY-MM-DD
- **Who:** Role(s) making decision
- **What:** The decision made
- **Why:** Rationale and context
- **Alternatives considered:** What else was evaluated
- **Impact:** What this affects
- **Status:** [Active | Superseded | Under Review]
```

---

## DEC-001: Use 10-agent orchestration model with FSA mandatory

- **Date:** 2025-11-08
- **Who:** PM + ARCH
- **What:** Adopt 10-agent model (PM, ARCH, FSA, API, UI, OPS, QA, SEC, ANALYST, WR) with FSA (Foundation Sourcing Agent) as mandatory role for all projects.
- **Why:**
  - FSA prevents "reinventing the wheel" - team can focus on differentiation
  - Scorecard-based selection ensures quality, security, license compliance
  - Golden bases accelerate integration (days instead of weeks)
  - Estimated time savings: 4+ months across 9 catalog areas
- **Alternatives considered:**
  - 8-agent model without FSA → rejected, would lead to ad-hoc tech choices and technical debt
  - FSA as optional role → rejected, too critical to be optional
  - External tech consultant → rejected, need continuous involvement
- **Impact:**
  - All projects require FSA assignment
  - FSA must complete scorecard for each catalog area
  - Golden bases become standard deliverables
  - `foundation_catalog.json` becomes living document
- **Status:** Active

---

## DEC-002: Target enterprise-grade from day 1, not MVP

- **Date:** 2025-11-08
- **Who:** PM
- **What:** Build enterprise-grade platform from start, not minimal viable product (MVP).
- **Why:**
  - Goal is to be **first in Sweden** with this class of platform
  - MVP would not differentiate from existing low-code tools
  - Retrofitting security, multi-tenancy, observability is 10x harder than building it in
  - Target market (enterprises) require high baseline quality
  - "Move fast and break things" incompatible with GDPR/security requirements
- **Alternatives considered:**
  - MVP approach → rejected, would not achieve market differentiation
  - Start with single-tenant → rejected, multi-tenant refactor is massive
  - Skip observability initially → rejected, debugging production issues without it is nightmare
- **Impact:**
  - Higher initial time/cost investment
  - Longer Phase 0 and Phase 1
  - Stricter quality gates from start
  - Better market positioning
  - Lower technical debt
- **Status:** Active

---

## DEC-003: Swedish/EU focus with GDPR-by-design

- **Date:** 2025-11-08
- **Who:** PM + SEC
- **What:** Focus on Swedish/EU market with GDPR-by-design, EU hosting, and Swedish/EU connectors prioritized.
- **Why:**
  - Market differentiation: most competitors are US-based with GDPR as afterthought
  - Compliance as competitive advantage (offentlig sektor, finans, hälsa)
  - Swedish connectors (BankID, Fortnox, Visma, Swish) are hard to find elsewhere
  - EU data residency is selling point
  - GDPR penalties are existential risk - better to build it right from start
- **Alternatives considered:**
  - US-first approach → rejected, different market with different needs
  - GDPR as post-launch addition → rejected, retrofitting is extremely costly
  - Global-neutral approach → rejected, "trying to please everyone pleases no one"
- **Impact:**
  - All connectors require ToS review (SEC role)
  - DPIA templates mandatory for all data processing
  - EU hosting preferred (affects OPS choices)
  - BankID, Fortnox, Visma, Swish prioritized over Plaid, QuickBooks, etc.
  - Data minimization and purpose limitation enforced in schema design
- **Status:** Active

---

## DEC-004: Use 6-stage handshake protocol for all tasks

- **Date:** 2025-11-08
- **Who:** PM + ARCH
- **What:** All tasks follow 6-stage handshake: PLAN → SPEC → DRAFT → REVIEW → COMMIT → RELEASE
- **Why:**
  - Prevents "cowboy coding" - everyone knows what's being built before code is written
  - SPEC stage catches design issues early (cheaper to fix)
  - REVIEW stage ensures SEC + QA sign-off before merge
  - Clear accountability at each stage
  - Enables parallelization (multiple tasks can be in different stages)
- **Alternatives considered:**
  - Simpler 3-stage (Plan → Code → Review) → rejected, too coarse-grained
  - Ad-hoc reviews → rejected, leads to missed security/quality issues
  - Waterfall (all planning upfront) → rejected, too inflexible
- **Impact:**
  - Every task in `task_dag.json` has handshake stages defined
  - SEC and QA have veto power in REVIEW stage
  - PM must approve COMMIT (final quality gate)
  - OPS controls RELEASE (deployment)
  - Slows down individual tasks but increases overall quality and reduces rework
- **Status:** Active

---

## DEC-005: Context continuity system for 50+ sessions

- **Date:** 2025-11-08
- **Who:** PM
- **What:** Implement comprehensive context continuity system with session_handoff.json, decision_log.md, assumptions.md, project_state.json, and knowledge_index.json.
- **Why:**
  - Project will span 50+ AI sessions (context window limitations)
  - Knowledge loss between sessions would be catastrophic
  - PM needs <5 min to get up to speed in new session
  - Decisions and assumptions must be logged for future reference
  - Enables multiple PMs or agent handoffs without knowledge loss
- **Alternatives considered:**
  - Rely on git history → rejected, too noisy and hard to extract decisions
  - Single large README → rejected, becomes outdated and too long to read
  - No formal system → rejected, guaranteed knowledge loss
- **Impact:**
  - PM must update session_handoff.json at end of every session
  - All decisions logged in decision_log.md immediately
  - All assumptions logged in assumptions.md immediately
  - project_state.json updated when task status changes
  - New session starts with reading session_handoff.json (~5 min)
- **Status:** Active

---

## Template for Future Decisions

```markdown
## DEC-XXX: [Short title]

- **Date:** YYYY-MM-DD
- **Who:** Role(s)
- **What:** Decision made
- **Why:** Rationale
- **Alternatives considered:** What else was evaluated
- **Impact:** What this affects
- **Status:** Active
```

---

**Last updated:** 2025-11-08 by PM (session 1)
**Total decisions:** 5
