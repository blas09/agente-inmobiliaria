# Pilot Readiness Backlog

Date: 2026-05-04

Status: completed for local supervised readiness with caveats.

This grooming covers the final project stage before a supervised customer MVP pilot: `Pilot Readiness`.

The goal is to make a clear go/no-go decision using the current scoped MVP:

`property -> lead -> conversation -> visit -> follow-up`

This phase should not add new product scope. It should validate readiness, classify remaining risk, and prepare support and feedback handling for the first supervised pilot.

## Grooming Scope

Reviewed references:

- [MVP Path To Customer Use](./mvp-path.md)
- [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md)
- [First Tenant Onboarding Runbook](./first-tenant-onboarding-runbook.md)
- [Security And Permissions Review Backlog](./security-permissions-review-backlog.md)
- [Real Tenant Onboarding Backlog](./real-tenant-onboarding-backlog.md)
- [Current MVP Status](./mvp-status.md)
- [Current Pending Work](./pending.md)

Out of scope for this stage:

- new features
- post-pilot feature expansion
- broad refactors
- self-service onboarding
- billing
- unsupervised production launch
- full external security or compliance audit

## Prioritization

- `P0`: blocks the supervised customer pilot go/no-go decision.
- `P1`: needed for controlled pilot operation and support confidence.
- `P2`: useful polish or follow-up that should not block a supervised pilot.
- `Post-MVP`: valuable after pilot learning, not required for first supervised pilot.

## Recommended Execution Order

1. `P0` Final QA Scope And Environment Confirmation
2. `P0` Customer-Like Core Flow Walkthrough
3. `P0` Pilot Caveats And Known Issues Review
4. `P0` WhatsApp Pilot Mode Decision
5. `P1` Support Ownership And Issue Intake Plan
6. `P1` Pause And Rollback Criteria
7. `P1` Feedback Capture Plan
8. `P0` Final Go/No-Go Checklist

## Current Baseline

The MVP implementation, UI/UX polish, operational readiness documentation, security permissions review, and real tenant onboarding documentation are complete with caveats.

This phase assumes the first tenant onboarding process has either been executed with customer-like data or is ready enough to execute before final go/no-go. If first-customer data or tenant setup is still missing, classify that as a pilot readiness blocker or accepted caveat before the final decision.

## Completion Result

Completion date: 2026-05-04

Decision: pilot readiness is documented for local supervised execution with `WhatsApp mode: simulated/manual`.

Recommendation: `go with caveats` for local supervised readiness, provided automated checks and the manual walkthrough in [Pilot Readiness Runbook](./pilot-readiness-runbook.md) pass and the pilot does not promise real WhatsApp provider delivery.

Accepted caveats:

- Real Meta WhatsApp inbound/outbound delivery is not part of this readiness pass.
- Conversation workflow is validated with existing or manually prepared conversation data.
- A separate Meta provider smoke test is required before promising real WhatsApp operation.
- Browser-level E2E coverage is not in place; manual walkthrough remains required.
- Public endpoint rate limiting remains a known hardening gap for broader exposure.

## Tasks

### PRD-001 - Final QA Scope And Environment Confirmation

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Project Manager, Project Leader / Technical Lead, QA Engineer / Test Agent, Backend / Security

Problem:

The pilot cannot be approved without knowing exactly which environment, data mode, checks, and caveats are part of the final QA pass.

Scope:

- Confirm target environment: local, staging, or production-like.
- Confirm whether the tenant uses real, anonymized, or sample data.
- Confirm required environment variables and Supabase connectivity.
- Confirm whether real WhatsApp provider delivery is in scope.
- Define the minimum automated checks to run before pilot.
- Define the minimum manual checks to run before pilot.

Out of scope:

- Creating new deployment automation.
- Adding a full browser E2E suite.
- Fixing unrelated post-MVP issues.

Acceptance criteria:

- Final QA environment is explicitly documented.
- Required checks are listed.
- Known missing checks are classified as accepted caveat, blocker, or post-MVP.
- The team knows which command/test/manual walkthrough proves readiness.

Verification:

- Review against `pilot-operations-runbook.md`.
- Execute documented checks during pilot readiness execution.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), section `2. Final QA Scope`.
- Local environment and WhatsApp simulated/manual mode are documented.
- Automated checks are defined as `pnpm lint`, `pnpm test`, and `pnpm build`, with `pnpm test` as the minimum during iteration.
- Manual readiness checks are listed for login, active tenant, roles, catalog, leads, conversations, visits, and accepted caveats.

### PRD-002 - Customer-Like Core Flow Walkthrough

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Commercial Domain, QA Engineer / Test Agent, UI/UX Specialist

Problem:

The final decision must be grounded in a realistic walkthrough of the core commercial operation, not only isolated technical checks.

Scope:

- Walk through the scoped MVP flow with customer-like data:
  `property -> lead -> conversation -> visit -> follow-up`.
- Include owner/admin perspective.
- Include advisor/operator perspective.
- Include read-only viewer checks only if the pilot uses a viewer.
- Validate Spanish UI copy, feedback, empty/error states, and action clarity in the pilot path.

Out of scope:

- Testing every post-MVP workflow.
- New UI polish unless a pilot blocker is found.
- Full mobile QA unless mobile use is part of the first pilot.

Acceptance criteria:

- Core flow can be completed end to end with customer-like data.
- No P0 UX or functional blocker remains.
- Any friction is classified as `pilot blocker`, `pilot degraded`, `non-blocker`, or `post-MVP`.

Verification:

- Manual walkthrough using the selected pilot tenant or a customer-like tenant.
- Record findings using the pilot issue intake format.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), section `3. Customer-Like Walkthrough`.
- The walkthrough validates `property -> lead -> conversation -> visit -> follow-up` without requiring real WhatsApp provider delivery.
- Conversation validation uses existing or manually prepared conversation data.

### PRD-003 - Pilot Caveats And Known Issues Review

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

The pilot must not start with ambiguous risk. Caveats must be explicitly accepted, resolved, or classified as blockers.

Scope:

- Review caveats from security, operations, onboarding, WhatsApp, testing, rate limiting, and browser E2E coverage.
- Classify each caveat as `accepted for supervised pilot`, `pilot blocker`, `pilot degraded`, `post-MVP`, or `needs decision`.
- Confirm the customer-facing expectation wording for known limitations.
- Link any blocker to a concrete follow-up task.

Out of scope:

- Solving all post-MVP caveats.
- External legal/security sign-off.

Acceptance criteria:

- No caveat remains unclassified.
- Pilot blockers are resolved or the pilot is paused.
- Accepted caveats are clear enough to communicate internally before pilot.

Verification:

- Review `pending.md`, `security-permissions-review-backlog.md`, `pilot-operations-runbook.md`, and `first-tenant-onboarding-runbook.md`.
- Produce a final caveat list during pilot readiness execution.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), section `5. Caveats And Known Issues`.
- WhatsApp real provider delivery, Meta template approval/sync, rate limiting, browser E2E, self-service onboarding, billing, Google Calendar, and advanced AI are classified.
- Blocker conditions are documented for tenant isolation, unauthorized writes, login, active tenant, core flow, and WhatsApp expectation mismatch.

### PRD-004 - WhatsApp Pilot Mode Decision

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Leader / Technical Lead, Integrations / WhatsApp, Backend / Security, QA Engineer / Test Agent

Problem:

WhatsApp readiness has different risks depending on whether the first customer pilot uses real Meta delivery, simulated/manual operation, or excludes WhatsApp.

Scope:

- Decide final WhatsApp mode for the first pilot:
  - real provider
  - simulated/manual
  - out of scope
- If real provider is selected, confirm credentials, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, webhook reachability, phone number ID, templates, and smoke test plan.
- If simulated/manual or out of scope, document the pilot script expectation.
- Confirm failed-message and channel-event review expectations.

Out of scope:

- Real Meta template approval/sync automation.
- New channel providers.
- Full omnichannel support.

Acceptance criteria:

- WhatsApp mode is explicitly decided before go/no-go.
- Real provider mode has required secrets and smoke-test criteria.
- Non-real mode has clear expectation wording and does not promise real delivery.

Verification:

- If real provider is in scope, run controlled inbound/outbound checks during execution.
- If not real provider, verify the pilot checklist and customer expectation wording.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), section `4. WhatsApp Mode Decision`.
- Decision: `simulated/manual`.
- Real inbound, outbound, webhook signature verification, template approval/sync, and provider lifecycle statuses are out of scope for this local readiness pass.
- Required wording states that real WhatsApp provider delivery is not part of this readiness pass and requires a separate Meta smoke test.

### PRD-005 - Support Ownership And Issue Intake Plan

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Project Manager, Product Owner, Project Leader / Technical Lead, QA Engineer / Test Agent

Problem:

A supervised pilot needs explicit support ownership. Otherwise, issues can be lost, duplicated, or treated as feature requests without triage.

Scope:

- Define support owner during the pilot.
- Define technical escalation owner.
- Define product decision owner.
- Reuse the pilot issue intake template.
- Define expected response and triage rhythm during the pilot window.
- Define where pilot issues are tracked.

Out of scope:

- Building support tooling.
- Production support SLAs.
- Customer-facing help center.

Acceptance criteria:

- Each pilot issue has an owner, class, and decision.
- The team knows where to record pilot issues.
- Escalation path is clear for blockers and degraded flows.

Verification:

- Review against the support section in `pilot-operations-runbook.md`.
- Dry-run issue intake with one sample issue.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), sections `6. Support Ownership` and `7. Issue Intake Format`.
- Support, product decision, technical escalation, issue intake, and customer communication ownership slots are defined.
- Issue classes reuse the existing pilot operations taxonomy.

### PRD-006 - Pause And Rollback Criteria

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

The team needs clear criteria for pausing or rolling back the pilot if a serious issue appears.

Scope:

- Define pilot pause criteria.
- Define rollback or disablement options available in the current product/ops setup.
- Define who can make a pause decision.
- Define how customer communication is handled if the pilot pauses.
- Include data/security issues, auth/tenant issues, core flow blockers, and WhatsApp failures.

Out of scope:

- Automated rollback tooling.
- Formal incident management program.

Acceptance criteria:

- Pause criteria are explicit.
- Decision owner is clear.
- At least one practical mitigation path exists for each major risk class.

Verification:

- Review against known caveats and support runbook.
- Tabletop one serious issue scenario before go/no-go.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), section `8. Pause And Rollback Criteria`.
- Pause criteria include tenant isolation, unauthorized writes, login/active tenant failures, core flow blockers, role setup blockers, suspected data corruption, and WhatsApp expectation mismatch.
- Practical mitigation paths are documented for tenant data, roles, core flow blockers, WhatsApp mode mismatch, and data quality issues.

### PRD-007 - Feedback Capture Plan

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Manager, UI/UX Specialist, QA Engineer / Test Agent

Problem:

Pilot feedback must be captured in a controlled way so the project can learn without turning every request into immediate scope.

Scope:

- Define how customer feedback is collected.
- Classify feedback as bug, UX friction, operational gap, feature request, or post-MVP idea.
- Define when feedback becomes a bug/hardening task versus roadmap input.
- Define post-pilot review timing.

Out of scope:

- Implementing analytics tooling.
- Accepting new feature requests into the active MVP without grooming.

Acceptance criteria:

- Feedback capture format is defined.
- Feedback classifications are clear.
- Post-pilot review process is defined.

Verification:

- Dry-run feedback capture with one sample UX issue and one feature request.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), section `9. Feedback Capture Plan`.
- Feedback classifications are defined as bug, UX friction, operational gap, feature request, post-MVP idea, and invalid/test-data.
- The runbook explicitly prevents adding new scope directly from pilot feedback without classification.

### PRD-008 - Final Go/No-Go Checklist

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

The project needs a single final readiness decision before starting the supervised customer pilot.

Scope:

- Summarize results from `PRD-001` through `PRD-007`.
- Confirm all P0 blockers are resolved.
- Confirm P1 risks are resolved or explicitly accepted.
- Confirm pilot scope and limitations are clear.
- Record final decision as `go`, `go with caveats`, or `no-go`.

Out of scope:

- Post-pilot roadmap reprioritization.
- Production launch decision.

Acceptance criteria:

- Final go/no-go decision is recorded.
- No unresolved P0 blocker remains.
- Accepted caveats are listed.
- Next action after the decision is explicit.

Verification:

- Review completed pilot readiness tasks.
- Confirm decision with Product Owner, Project Manager, and Project Leader / Technical Lead.

Completion notes:

- Covered in [Pilot Readiness Runbook](./pilot-readiness-runbook.md), section `10. Final Go/No-Go Checklist`.
- Current recommendation is `go with caveats` for local supervised readiness.
- Final execution still requires automated checks and manual walkthrough to pass against the selected tenant.
- Real WhatsApp provider delivery must remain excluded unless a separate Meta provider smoke test is completed.
