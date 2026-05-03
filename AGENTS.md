# AGENTS.md

## Project Goal

Multitenant SaaS for real estate agencies in Paraguay, focused on centralizing properties, leads, conversations, appointments, FAQs, channels, and commercial operations assisted by automation and AI.

The current focus is to close a scoped, testable commercial MVP with a solid foundation for multitenancy, permissions, WhatsApp, and operational workflows.

## Global Rules

- Keep tenant isolation in every business entity.
- Do not rely on UI permissions as the only enforcement layer.
- Validate input with Zod at input boundaries.
- Before implementing a new feature, classify it as `MVP`, `post-MVP`, `technical debt`, `bug`, or `exploration`.
- Do not implement `post-MVP` or `exploration` features without an explicit decision.
- Prefer existing patterns before creating new abstractions.
- Keep changes scoped to the task domain.
- Do not change the global visual direction without an explicit decision.
- Do not edit `.env.local`, secrets, or real credentials unless explicitly requested.
- Do not revert changes made by others.
- Do not document reflexively; update documentation when decisions, MVP status, conventions, or relevant behavior change.

## Language Policy

- Internal engineering language is English.
- User-facing product language is Spanish.
- Code identifiers, file names, folder names, types, schemas, tests, technical comments, commits, PRs, and agent/developer documentation should be written in English.
- UI labels, navigation, form messages, empty states, customer-facing emails, WhatsApp templates, and other visible product copy should be written in Spanish unless a specific feature requires otherwise.
- Do not do large naming refactors only to translate existing code. Apply this convention to new work and opportunistic edits when the touched area is already being changed.

## Engineering Principles

- Keep code simple, explicit, and boring unless complexity is justified.
- Avoid duplicating business logic. Extract shared helpers only when reuse is real and the abstraction is clear.
- Keep functions small and focused on one responsibility.
- Prefer descriptive names over comments that explain unclear code.
- Keep validation at system boundaries: forms, server actions, route handlers, webhooks, and external adapters.
- Separate UI, data access, business rules, and external integrations.
- Avoid hidden side effects. Make mutations and external calls explicit.
- Handle errors explicitly. Do not swallow exceptions silently.
- Prefer strict types. Avoid `any` unless there is a documented reason.
- Do not mix broad refactors with feature work unless required for the task.
- Do not introduce dependencies without clear value and low maintenance risk.
- Write tests for critical business logic, permissions, integrations, and reproducible bugs.
- Keep changes small enough to review safely.

## MVP Governance

The project must move toward a scoped MVP. The priority is to validate a complete commercial operation for a real estate agency before expanding scope.

### MVP Scope

- Users, roles, and permissions secure enough for internal testing.
- Operational properties as the commercial source of truth.
- Operational leads with assignment, status, and basic pipeline.
- Operational conversations with manual replies, handoff, and links to leads/properties.
- Basic appointments workflow for property visits.
- WhatsApp reliable enough for internal testing.
- Minimal reports to understand commercial activity.

### Out of Scope Until Explicit Decision

- Advanced AI.
- Billing.
- Full omnichannel support.
- Google Calendar.
- Complex automations.
- Global visual rewrite.
- Large external integrations that do not block MVP validation.

### Work Classification

- `MVP`: required to test or sell the initial commercial MVP.
- `bug`: reproducible error or current operational risk.
- `technical debt`: improvement needed to sustain security, quality, or delivery speed without changing visible product behavior.
- `post-MVP`: valuable, but not required to validate the MVP.
- `exploration`: research or prototype without implementation commitment.

Only `MVP`, `bug`, and justified `technical debt` should enter the normal implementation flow.

## Architecture

- `app/`: routing, layouts, pages, route handlers, and server actions close to the UI.
- `features/`: views, forms, schemas, and UI use cases by domain.
- `server/`: queries, repositories, services, policies, and server-side backend logic.
- `integrations/`: external adapters such as WhatsApp, email, and AI.
- `components/`: reusable visual components without strong domain knowledge.
- `lib/`: shared utilities, environment, helpers, and cross-cutting validations.
- `supabase/`: migrations, seed, and reproducible SQL.
- `tests/`: automated tests.
- `types/`: shared types.

## Dependency Rules

- `app` may use `features`, `components`, `server`, and `lib`.
- `features` may use `components`, `lib`, and `server`.
- `server` must not depend on `app`.
- `integrations` may depend on `server` and `lib`, never on `app`.
- `components/ui` must not know the product domain.

## Multitenancy and Security

- Every business table must have `tenant_id`, unless there is an explicit justification.
- Every tenant-scoped query must filter by active tenant or rely on RLS in a controlled way.
- Mutations must validate user, tenant, and role on the server.
- `platform_admin` must be treated as a global role separate from tenant-scoped logic.
- Webhooks, jobs, and machine-to-machine operations must have separate, auditable rules with controlled service role usage.
- Secrets must not be stored or exposed in operational tables; use references like `credentials_ref` when applicable.
- AI must not decide business truth: prices, availability, commercial rules, and operational status come from structured data.

## Agent Roles

### Product Owner

Defines what is worth building and what stays out. Keeps MVP focus, prioritizes by commercial value, and validates that each feature helps the main real estate operation flow: property -> lead -> conversation -> visit -> follow-up.

Must block scope creep when an idea does not help test or sell the initial commercial MVP.

### Project Manager

Turns the roadmap into ordered execution. Creates concrete tasks, separates epics, features, bugs, and technical debt, defines dependencies, tracks progress, and verifies that each task has a closure criterion.

Must keep `docs/roadmap.md`, `docs/mvp-status.md`, and `docs/pending.md` updated when the real project state changes.

### Project Leader / Technical Lead

Defines the technical scope of each task and turns a prioritized need into a concrete implementation plan. Decides technical impact, affected domains, work order, ownership, minimum verification, and whether migrations, tests, refactors, or documentation are needed.

Must avoid overbuilt solutions and protect the repo's existing technical patterns.

### Architecture and Multitenancy

Validates structure, boundaries, dependencies, tenant isolation, RLS, global roles, and consistency with the project's base decisions.

### Commercial Domain

Validates functional behavior for properties, leads, conversations, appointments, pipeline, FAQs, channels, tenants, and real estate operations.

### Backend / Security

Implements and reviews server actions, route handlers, queries, repositories, services, policies, validations, permissions, and errors.

### Integrations / WhatsApp

Implements and reviews webhooks, inbound, outbound, templates, channel events, idempotency, request signatures, tenant credentials, and external error handling.

### UI/UX Specialist

Owns visual coherence, ease of use, hierarchy, density, responsive behavior, empty states, errors, loading states, and transactional feedback.

Must keep the interface consistent with the current visual system and validate that each screen helps users operate better, not only look better.

### Frontend Engineer

Implements components, screens, forms, states, and responsive behavior using existing patterns. Works with the UI/UX Specialist when a task touches visual or operational experience.

### QA Engineer / Test Agent

Defines and runs the minimum testing strategy according to change risk. Reviews regressions, permissions, tenant isolation, and critical manual flows.

Must write or request tests when the change warrants it, especially for reproducible bugs, permissions, business logic, integrations, and data transformations.

### Documentation / Roadmap

Updates `README.md`, `docs/roadmap.md`, `docs/mvp-status.md`, `docs/pending.md`, or other documents when decisions, conventions, MVP status, or relevant behavior change.

## Orchestration for New Features

1. Product Owner defines objective, commercial value, MVP scope, and priority.
2. Project Manager turns the objective into concrete tasks, dependencies, and closure criteria.
3. Project Leader / Technical Lead defines technical scope, plan, risks, affected domains, ownership, and minimum verification.
4. Architecture and Multitenancy reviews impact on structure, tenant isolation, RLS, and permissions.
5. Commercial Domain validates expected behavior if the feature touches business workflows.
6. Backend / Security implements or reviews model, queries, server actions, route handlers, policies, and validations.
7. Integrations / WhatsApp participates if channels, webhooks, templates, events, or external providers are involved.
8. UI/UX Specialist validates visual coherence and ease of use when there are interface changes.
9. Frontend Engineer implements the interface using existing patterns.
10. QA Engineer / Test Agent runs automated checks, manual tests, and adds tests proportional to risk.
11. Project Manager updates progress and blockers.
12. Documentation / Roadmap updates documents when applicable.

## Orchestration for Roadmap

1. Product Owner defines or adjusts the MVP objective.
2. Project Manager reviews `docs/roadmap.md`, `docs/mvp-status.md`, and `docs/pending.md`.
3. Product Owner and Project Manager classify items as `MVP`, `post-MVP`, `technical debt`, `bug`, or `exploration`.
4. Project Manager orders the backlog into `must have`, `should have`, `post-MVP`, `do not touch yet`, and `bugs / hardening`.
5. Project Leader / Technical Lead only takes tasks ready for implementation, with clear scope and closure criteria.
6. When a task closes, Project Manager updates documentation state when applicable.

## Bug Flow

1. Reproduce or isolate the bug.
2. Identify the domain and main owner.
3. Fix the cause, not only the visible symptom.
4. Add or adjust tests when the bug is easy to cover.
5. Run focused verification.
6. Document only if expected behavior or roadmap state changes.

## Closure Checklist

- The task was classified as `MVP`, `bug`, `technical debt`, `post-MVP`, or `exploration`.
- If it was not `MVP` or `bug`, there was an explicit decision to proceed.
- Closure criteria are met.
- Technical scope was defined and stayed scoped.
- The change respects tenant isolation.
- Mutations validate user, tenant, and role on the server.
- Inputs are validated with schemas or equivalent validations.
- The UI uses existing components and patterns.
- UI/UX reviewed visual coherence and ease of use when there were relevant interface changes.
- Empty states, errors, and transactional feedback are clear when applicable.
- Migrations and seeds are included when the data model changed.
- Webhooks or integrations have idempotency and traceability when applicable.
- QA ran the reasonable minimum verification.
- Tests were added or adjusted when the change warranted it.
- Documentation was updated if MVP state, a decision, or a convention changed.

## Common Commands

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
```

`pnpm dev` and `pnpm start` use `127.0.0.1:3003` in this repo.

## Do Not Touch Yet Without Explicit Decision

- Advanced AI.
- Billing.
- Full omnichannel support.
- Google Calendar.
- Global visual rewrite.
- Broad architecture changes.
