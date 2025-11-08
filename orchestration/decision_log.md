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

## DEC-006: Primary focus is BUILDER CAPACITY, connectors are secondary

- **Date:** 2025-11-08
- **Who:** PM + ARCH (based on user clarification)
- **What:** Primary value is the ability to BUILD any application (databases, UI, API, logic) from scratch. Connectors (BankID, Stripe, etc.) are SECONDARY features that connect to already-built apps.
- **Why:**
  - Initial project description over-emphasized connectors as primary feature
  - User clarification: "huvudsyftet är ju inte att kunna koppla bank id till något som byggts, det är ju att kunna bygga det som sen ska kunna ha dessa anslutna tjänster"
  - Core differentiation is UNIVERSAL BUILDER (build ANY app type), not connector catalog
  - Connectors add value but are not the primary value proposition
- **Alternatives considered:**
  - Connectors as primary feature → rejected, wrong focus
  - Equal focus on builder + connectors → rejected, muddy value prop
- **Impact:**
  - Blueprint/DSL spec must focus on: datamodeller (schemas, relations), UI components, API endpoints, business logic, auth rules FIRST
  - Connector SDK is important but secondary deliverable
  - FSA catalog areas should prioritize: DB/ORM, UI/Designsystem, API/Framework, Workflows BEFORE connector integrations
  - Marketing/GTM should lead with "build any app" not "Swedish connectors"
  - Task prioritization in Phase 1: Core builder (codegen for DB + UI + API + logic) before connector implementation
- **Status:** Active

---

## DEC-007: "VEM SOM HELST kan bygga VAD SOM HELST" - AI-powered democratization

- **Date:** 2025-11-08
- **Who:** PM (based on user clarification)
- **What:** Core positioning är "VEM SOM HELST kan bygga VILKEN APP SOM HELST". AI hanterar det tekniska så icke-tekniska användare kan bygga professionella appar. Detta är både goodwill OCH business-critical.
- **Why:**
  - User clarification: "Jag ville bara få fram att appen ska bli känd för att den kan bygga 'vad som helst' och gärna nästan av vem som helst - att göra användningen av ai för avancerade tekniska saker är både goodwill och helt avgörande för affären"
  - Demokratisering av app-utveckling är både rättvist OCH bra för innovation/ekonomi
  - Traditionellt har app-utveckling varit reserverat för dem med teknisk utbildning/resurser
  - AI-powered democratization gör att ALLA - oavsett bakgrund, utbildning, ekonomiska resurser - kan realisera sina idéer
  - Särskilt viktigt för jämställdhet: kvinnor/underrepresenterade grupper har mindre tillgång till teknisk kompetens
  - AI som hanterar det tekniska är goodwill (folk älskar det) OCH avgörande för affären (utan AI skulle detta inte vara möjligt)
- **Alternatives considered:**
  - Fokus endast på developers/tekniska användare → rejected, begränsar marknad och impact
  - Positionera som "low-code" istället för "AI-powered" → rejected, AI är differentiator och goodwill-generator
- **Impact:**
  - Marketing/GTM leder med: "VEM SOM HELST kan bygga VILKEN APP SOM HELST - AI hanterar det tekniska"
  - Target users expanderar: citizen developers, business people, entrepreneurs, småföretagare, ALLA med idéer
  - Value prop: Demokratisering av innovation och företagande
  - Brand positioning: Inkluderande, jämställdhet, tillgänglighet
  - Success metrics bör inkludera: % icke-tekniska användare, diversity metrics
  - Conversational interface är PRIMÄR (inte GUI Studio) för icke-tekniska
- **Status:** Active

---

## DEC-008: Omställningsverktyg för AI-driven värld + generationell bredd

- **Date:** 2025-11-08
- **Who:** PM (based on user vision)
- **What:** Detta är inte bara en builder - det är ett OMSTÄLLNINGSVERKTYG för folk som förlorar jobb pga AI-automatisering. Generationell bredd: från kids (12 år, sociala medier) till 50-åringar som behöver ställa om karriär. "Folk kan bli utvecklare utan att kunna utveckla - precis som AI gör att folk som inte kan skriva kan bli skribenter."
- **Why:**
  - User vision: "vi blir appen som blir för alla som kommer bli av med sina jobb pga all automatisering"
  - AI tar över allt fler jobb (content writers, designers, data analysts, etc.) - folk behöver nya skills för att vara EMPLOYABLE
  - Kids (12-18) vill bygga saker för sociala medier (Snapchat, TikTok) och imponera på kompisar
  - Marknadsförare vill bygga webbshoppar och kampanjsidor utan tech-team
  - B2B: färdiga webbshoppar, booking systems behöver betalningar (Stripe, Klarna, Swish) - KRITISKT
  - Analogi: "precis som AI gör icke-skribenter till skribenter, gör vi icke-developers till developers"
  - Detta är både professionellt verktyg OCH consumer/ungdoms-app - BRED marknad
- **Alternatives considered:**
  - Fokus endast på professionals → rejected, missar enorm marknad (kids, omställare, hobbyister)
  - Fokus endast på consumer → rejected, B2B är där pengarna finns
  - Ignorera omställningsaspekt → rejected, detta är HUGE goodwill och societal impact
- **Impact:**
  - **Target users expanderar enormt:** Folk som mister jobb, kids 12-18, marknadsförare, B2B, ALLA åldrar
  - **UX måste vara super-enkelt:** 12-åringar måste förstå, 50-åringar utan tech-skills måste förstå
  - **Betallösningar (Stripe, Klarna, Swish) och business-connectors (Fortnox, Visma) är KRITISKA för B2B** - måste fungera out-of-the-box
  - **Marketing berättelse:** "Mister du jobbet till AI? Bli developer utan att kunna koda. 12 år? Bygg din första app idag."
  - **Social impact messaging:** Omställning, employability i AI-era, jämlikhet, generationell inkludering
  - **Success metrics:** % omställare som fick jobb, % ungdomar <18 år, % B2B med betalningar live
  - **Pricing models:** Måste ha gratis tier för kids och omställare, B2B betalar premium
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
**Total decisions:** 8
