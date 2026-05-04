# Operational MVP Readiness Backlog

Date: 2026-05-04

Status: proposed for review.

This grooming covers the next project stage defined in [MVP Path To Customer Use](./mvp-path.md): `Operational MVP Readiness`.

The goal is to prepare the product for a supervised customer pilot with real operational data, predictable setup, known limits, and a basic support process. This is not a feature-expansion phase.

## Grooming Scope

Reviewed references:

- [MVP Path To Customer Use](./mvp-path.md)
- [Current MVP Status](./mvp-status.md)
- [Internal Pilot Checklist](./internal-pilot-checklist.md)
- [Execution Backlog](./backlog.md)
- [Current Pending Work](./pending.md)
- [UI/UX MVP Polish Backlog](./ui-ux-backlog.md)

Out of scope for this stage:

- self-service onboarding
- billing operations
- automated imports
- production-scale support tooling
- advanced analytics
- new product workflows
- broad security review, which belongs to the next `Security And Permissions Review` phase

## Prioritization

- `P0`: blocks preparing or supporting a supervised customer pilot.
- `P1`: needed for predictable pilot operation.
- `P2`: useful operational polish that should not delay pilot readiness.
- `Post-MVP`: useful, but not needed for the first supervised pilot.

## Recommended Execution Order

1. `P0` Pilot Tenant Setup Runbook
2. `P0` Customer Data Preparation Checklist
3. `P0` Known Limitations And Pilot Caveats
4. `P1` Support And Issue Classification Runbook
5. `P1` Environment And Deployment Readiness Checklist
6. `P1` Minimal Observability And Error Review Procedure
7. `P1` Pilot Dry Run Checklist

## Tasks

### OR-001 - Pilot Tenant Setup Runbook

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

A pilot tenant can be configured today, but the process still depends on developer memory and ad hoc decisions. A supervised pilot needs a repeatable setup procedure.

Scope:

- Document the minimum steps to create or configure a pilot tenant.
- Include required tenant settings: name, slug, currency, timezone, appointment rules, users, roles, pipeline stages, FAQs, channels, and properties.
- Identify which steps are done from UI and which require environment/provider access.
- Include local and target-environment variants where they differ.
- Include verification steps after setup.

Out of scope:

- Self-service onboarding.
- Automated tenant provisioning.
- Billing or contractual setup.

Acceptance criteria:

- A team member can prepare a pilot tenant without asking for implementation context.
- Required setup data is explicit.
- Each setup step has an expected result.
- Manual verification is documented.

Verification:

- Dry-run the checklist against local or staging data.
- Confirm no step requires hidden knowledge.

### OR-002 - Customer Data Preparation Checklist

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Commercial Domain, QA Engineer / Test Agent

Problem:

The first pilot needs realistic starting data. Without a preparation checklist, onboarding may stall on missing property, lead, FAQ, or channel information.

Scope:

- Define the minimum required data for a pilot.
- Cover properties, leads, FAQs, appointment rules, users, roles, and channel details.
- Separate required data from optional data.
- Define accepted formats for manual entry.
- Add a small data-quality checklist before loading data into the tenant.

Out of scope:

- Automated CSV/import tooling.
- Rich media preparation.
- Deduplication workflows.

Acceptance criteria:

- The project knows what to request from the pilot customer before setup starts.
- Required vs optional data is clear.
- Data quality checks reduce obvious setup mistakes.

Verification:

- Review checklist against the current UI forms.
- Confirm all required fields can be entered through existing screens or documented manual steps.

### OR-003 - Known Limitations And Pilot Caveats

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, UI/UX Specialist

Problem:

The product is not ready for unsupervised customer use. The team needs a clear known-limits list before exposing it to a pilot customer.

Scope:

- Document what is explicitly supported in the pilot.
- Document what is intentionally not supported.
- Include caveats for WhatsApp provider credentials, Meta template approval/sync, rate limiting, E2E tests, onboarding, billing, media, advanced AI, and integrations.
- Add recommended wording for internal customer-facing expectations.
- Classify each limitation as `pilot caveat`, `operational risk`, or `post-MVP`.

Out of scope:

- Fixing every listed limitation.
- Public marketing copy.

Acceptance criteria:

- The team can explain what the pilot can and cannot do.
- Caveats are concrete, not vague.
- No known material limitation is hidden from pilot planning.

Verification:

- Review against `mvp-status.md`, `internal-pilot-checklist.md`, and `pending.md`.

### OR-004 - Support And Issue Classification Runbook

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Project Manager, Project Leader / Technical Lead, QA Engineer / Test Agent, Backend / Security

Problem:

During a pilot, issues need to be classified consistently. Without a lightweight runbook, every failure becomes an interrupt and priority decisions become noisy.

Scope:

- Define issue categories: `pilot blocker`, `pilot degraded`, `non-blocker`, `post-MVP`, and `invalid/test-data`.
- Define what information to collect for each issue.
- Define first checks for auth, active tenant, role, data setup, appointments, channels, WhatsApp events, and server errors.
- Define who owns triage and who decides whether to pause a pilot.
- Include a simple issue template.

Out of scope:

- Full customer support platform.
- SLAs.
- On-call schedule automation.

Acceptance criteria:

- Pilot issues can be triaged consistently.
- The minimum diagnostic data is clear.
- Pause/escalation criteria are explicit.

Verification:

- Simulate at least three issue examples and classify them.

### OR-005 - Environment And Deployment Readiness Checklist

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

The internal checklist documents local testing, but pilot readiness needs an environment checklist for the target runtime.

Scope:

- Document required environment variables.
- Document Supabase project readiness checks.
- Document database migration and seed/data loading expectations.
- Document build, lint, test, and typecheck commands.
- Document deployment target assumptions.
- Include rollback or pause criteria if the target environment is not ready.

Out of scope:

- Full CI/CD implementation.
- Infrastructure-as-code.
- Production launch automation.

Acceptance criteria:

- A target environment can be validated before inviting a pilot user.
- Required secrets and provider credentials are explicit.
- Build and database readiness checks are documented.

Verification:

- Run the checklist locally where possible.
- Mark unavailable target-environment checks as pending with owner.

### OR-006 - Minimal Observability And Error Review Procedure

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

The app has some structured logs and channel events, but the team needs a documented procedure for reviewing failures during a pilot.

Scope:

- Identify where to check application errors, Supabase logs, auth issues, audit logs, channel events, failed messages, and appointment/action failures.
- Define a daily pilot review checklist.
- Define what must be captured before retrying or changing data.
- Link the procedure to the support runbook.

Out of scope:

- New logging platform.
- Advanced alerting.
- Distributed tracing.

Acceptance criteria:

- The team knows where to look when something fails.
- Error review can happen without guessing table names or screens.
- Retry/error handling is tied to the relevant UI screens where possible.

Verification:

- Walk through one simulated WhatsApp failure and one form/server-action failure.

### OR-007 - Pilot Dry Run Checklist

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, QA Engineer / Test Agent, UI/UX Specialist

Problem:

Before a real customer pilot, the team needs one end-to-end dry run with customer-like data and the operational runbooks in hand.

Scope:

- Create a dry-run checklist based on the internal pilot checklist.
- Include user roles, tenant setup, data setup, property, lead, conversation, appointment, FAQ, channel, and support scenarios.
- Include go/no-go criteria.
- Include what should be updated after the dry run.

Out of scope:

- Full E2E automation.
- External customer session planning.

Acceptance criteria:

- The team can rehearse the pilot before exposing it to a customer.
- Go/no-go criteria are clear.
- Any issue found has a place to be classified and followed up.

Verification:

- Execute the dry run once after OR-001 through OR-006 are completed.
