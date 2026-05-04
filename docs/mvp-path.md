# MVP Path To Customer Use

Date: 2026-05-03

This document defines the grooming sequence from the current internal MVP state to an MVP that can be used by a final customer in a supervised pilot.

The goal is to avoid open-ended feature expansion. Each grooming pass must produce a prioritized, executable backlog with clear acceptance criteria before implementation starts.

## Current Position

The scoped internal MVP covers:

`property -> lead -> conversation -> visit -> follow-up`

Current decision:

- the internal MVP flow has been manually tested
- UI/UX polish, operational readiness documentation, and security permissions review are complete with documented caveats
- the next product phase should focus on real tenant onboarding for a supervised pilot
- work should continue through sequenced grooming passes
- each grooming pass should be reviewed before execution starts

## Grooming Principles

- Groom one phase at a time.
- Keep implementation out of grooming unless a blocking discovery requires a small spike.
- Convert findings into numbered tasks with priority, owner roles, scope, out-of-scope notes, acceptance criteria, and verification.
- Prioritize by customer usability, operational risk, and MVP focus.
- Execute accepted tasks sequentially unless parallel work is explicitly approved.
- Update `docs/backlog.md`, `docs/roadmap.md`, `docs/mvp-status.md`, and `docs/pending.md` only when the product state or execution priorities change.

## Prioritization Model

- `P0`: blocks a supervised customer pilot.
- `P1`: needed for a consistent MVP customer experience.
- `P2`: polish or improvement that should not delay a pilot.
- `Post-MVP`: useful, but not needed for the first customer-facing MVP.

## Grooming Sequence

### 1. UI/UX MVP Polish

Objective:

Make the existing product clear, consistent, and comfortable enough for a real customer to use under supervision.

Primary roles:

- Product Owner
- Project Manager
- Project Leader / Technical Lead
- UI/UX Specialist
- Frontend Engineer
- QA Engineer / Test Agent

Scope:

- navigation clarity
- visual hierarchy
- desktop and responsive behavior in core flows
- forms, validation messages, empty states, error states, loading states, and success feedback
- Spanish UI microcopy
- action placement and primary/secondary action consistency
- flow continuity across properties, leads, conversations, appointments, and dashboard

Out of scope:

- new large product features
- external integrations
- architecture rewrites
- self-service onboarding
- billing
- advanced AI

Expected output:

- prioritized UI/UX backlog
- screen-by-screen findings
- acceptance criteria for each task
- verification plan with manual checks and screenshots where useful

Exit criteria:

- core MVP flows are visually coherent
- primary actions are obvious
- common empty/error/loading states are handled consistently
- no major desktop or mobile layout issue blocks customer testing

### 2. Operational MVP Readiness

Objective:

Prepare the product to sustain a supervised customer pilot with real operational data and predictable support.

Primary roles:

- Product Owner
- Project Manager
- Project Leader / Technical Lead
- Backend / Security
- QA Engineer / Test Agent

Scope:

- tenant setup procedure
- user and role setup procedure
- initial property, lead, FAQ, and channel data loading
- operational runbook
- known limitations
- support and issue classification workflow
- environment and deployment readiness checklist
- minimal observability and error review procedure

Out of scope:

- fully automated onboarding
- billing operations
- production-scale support tooling
- advanced analytics

Expected output:

- operational readiness backlog
- pilot setup checklist
- customer-support runbook draft
- known-limits list

Exit criteria:

- a pilot tenant can be prepared without ad hoc decisions
- support knows what to check when something fails
- known limitations are documented before customer use

### 3. Security And Permissions Review

Objective:

Verify tenant isolation and role behavior before any customer-facing pilot.

Primary roles:

- Project Leader / Technical Lead
- Architecture and Multitenancy
- Backend / Security
- QA Engineer / Test Agent

Scope:

- RLS policy review for critical tables
- server action permission review
- route protection review
- role/action matrix validation
- cross-tenant negative cases
- public endpoint hardening review
- machine-to-machine webhook boundaries

Out of scope:

- full external security audit
- compliance certification
- large authorization model redesign

Expected output:

- security review checklist
- prioritized permission/security backlog
- manual and automated negative-case plan

Exit criteria:

- tenant isolation is verified for critical reads and writes
- role-sensitive actions have server-side guards
- public endpoints have documented caveats or mitigations

### 4. Real Tenant Onboarding

Objective:

Define the minimum practical process to onboard the first real customer without manual uncertainty.

Primary roles:

- Product Owner
- Project Manager
- Project Leader / Technical Lead
- Backend / Security
- UI/UX Specialist

Scope:

- create or configure tenant
- create initial users and roles
- load initial properties
- configure FAQs and appointment rules
- configure channel data and credentials where applicable
- verify first login and active tenant behavior
- prepare initial customer-facing instructions

Out of scope:

- full self-service onboarding
- billing
- public marketing signup
- automated imports unless required by the first pilot

Expected output:

- first-customer onboarding checklist
- onboarding backlog
- data preparation template

Exit criteria:

- the first pilot tenant can be configured repeatably
- required customer data is known before onboarding starts
- login and core flow are validated with customer-like data

### 5. Pilot Readiness

Objective:

Make a final go/no-go decision for a supervised customer pilot.

Primary roles:

- Product Owner
- Project Manager
- Project Leader / Technical Lead
- QA Engineer / Test Agent
- Backend / Security
- UI/UX Specialist

Scope:

- final QA pass
- pilot checklist
- known issues review
- customer workflow walkthrough
- support ownership
- rollback or pause criteria
- feedback capture process

Out of scope:

- post-pilot feature expansion
- broad refactors
- unsupervised production launch

Expected output:

- pilot readiness checklist
- go/no-go recommendation
- pilot monitoring and feedback plan

Exit criteria:

- no known `P0` pilot blocker remains
- `P1` risks are explicitly accepted or resolved
- pilot scope and limitations are clear

### 6. Post-Pilot Feedback Loop

Objective:

Turn real customer feedback into a controlled post-MVP backlog without losing the MVP scope.

Primary roles:

- Product Owner
- Project Manager
- Project Leader / Technical Lead
- UI/UX Specialist
- QA Engineer / Test Agent

Scope:

- classify feedback as bug, UX friction, operational gap, feature request, or post-MVP idea
- separate urgent fixes from roadmap work
- update roadmap based on observed use, not assumptions
- define the next MVP iteration

Out of scope:

- accepting every customer request as immediate scope
- replacing the roadmap without prioritization

Expected output:

- post-pilot findings
- updated backlog
- next iteration recommendation

Exit criteria:

- pilot learnings are documented
- next work is prioritized
- product scope remains deliberate

## Immediate Next Step

Groom `Real Tenant Onboarding` into a prioritized backlog with clear customer data requirements, setup steps, acceptance criteria, and verification.

The security permissions review output is documented in [Security And Permissions Review Backlog](./security-permissions-review-backlog.md).
