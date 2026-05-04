# Security And Permissions Review Backlog

Date: 2026-05-04

Status: review completed with pilot caveats.

This grooming covers the next project stage defined in [MVP Path To Customer Use](./mvp-path.md): `Security And Permissions Review`.

The goal is to verify tenant isolation and role behavior before any customer-facing supervised pilot. This is a focused product-security review, not a full external security audit.

## Grooming Scope

Reviewed references:

- [MVP Path To Customer Use](./mvp-path.md)
- [Execution Backlog](./backlog.md)
- [Architecture](./architecture.md)
- [Current MVP Status](./mvp-status.md)
- [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md)
- [Current Pending Work](./pending.md)

Out of scope for this stage:

- full external penetration test
- compliance certification
- large authorization model redesign
- self-service onboarding security
- billing security
- broad infrastructure automation
- replacing Supabase RLS

## Prioritization

- `P0`: must be verified before a customer-facing supervised pilot.
- `P1`: needed for strong pilot confidence and maintainability.
- `P2`: useful hardening that should not block the first supervised pilot unless a concrete issue is found.
- `Post-MVP`: important later, but outside the first pilot readiness decision.

## Recommended Execution Order

1. `P0` RLS Policy Review For Critical Tables
2. `P0` Server Action Permission Review
3. `P0` Route Protection And Active Tenant Review
4. `P0` Cross-Tenant Negative Case Plan
5. `P1` Role/Action Matrix Validation
6. `P1` Public Endpoint And Webhook Boundary Review
7. `P1` Security Review Exit Checklist

## Current Baseline

The previous MVP permission pass already documented a role/action matrix and tightened several server-side guards. This review should not restart from zero. It should verify that the implemented system still matches the expected security model after the UI/UX and operational readiness phases.

Existing expected role/action matrix from the MVP backlog:

| Area                                   | Allowed roles                                         | Server guard                                        |
| -------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| Platform tenant create/update          | `platform_admin`                                      | `requirePlatformAdmin`                              |
| Current tenant settings                | `tenant_owner`, `tenant_admin`                        | `requireTenantAdminContext`                         |
| Tenant users and memberships           | `tenant_owner`, `tenant_admin`                        | `requireTenantAdminContext`                         |
| Channels and WhatsApp templates        | `tenant_owner`, `tenant_admin`                        | `requireTenantAdminContext`                         |
| Pipeline stages                        | `tenant_owner`, `tenant_admin`                        | `requireTenantAdminContext`                         |
| Properties create/update               | `tenant_owner`, `tenant_admin`, `advisor`, `operator` | `requirePropertyWriteContext`                       |
| Properties delete                      | `tenant_owner`, `tenant_admin`                        | `requirePropertyDeleteContext`                      |
| Leads create/update/routing            | `tenant_owner`, `tenant_admin`, `advisor`, `operator` | `requireLeadWriteContext`                           |
| Leads delete                           | `tenant_owner`, `tenant_admin`                        | `requireLeadDeleteContext`                          |
| Conversations operate/reply/link/retry | `tenant_owner`, `tenant_admin`, `advisor`, `operator` | `requireConversationOperateContext`                 |
| Appointments create/update             | `tenant_owner`, `tenant_admin`, `advisor`, `operator` | `requireAppointmentWriteContext`                    |
| Appointment rules                      | `tenant_owner`, `tenant_admin`                        | `requireTenantAdminContext`                         |
| FAQs create/update/delete              | `tenant_owner`, `tenant_admin`, `operator`            | `requireFaqManageContext`                           |
| WhatsApp webhook ingestion             | machine-to-machine                                    | signature verification plus service-role processing |

## Review Result

Review date: 2026-05-04

Decision: no code-level pilot blocker was found in this pass. The project can move to `Real Tenant Onboarding` for a supervised pilot after the environment-level caveats below are confirmed.

Pilot caveats:

- Real WhatsApp webhook traffic must run with `WHATSAPP_APP_SECRET` configured. Without it, the POST webhook route can accept unsigned payloads by design for local/dev flexibility.
- The `platform_admin` role has global tenant visibility through the RLS helper functions. This is intentional, but platform admin accounts must be treated as highly privileged and should not be used for daily agency operations.
- Public endpoint rate limiting remains a known hardening gap. It should not block a supervised pilot, but it should stay visible before broader exposure.
- Browser-level E2E cross-tenant tests are still not in place. Representative RLS checks were executed locally, but full browser automation remains future hardening.

Verification performed:

- Static review of `supabase/migrations`, `server/auth/tenant-context.ts`, `lib/permissions.ts`, critical `features/*/actions.ts`, dashboard route/page files, auth callback, and WhatsApp webhook code.
- Local Supabase inspection confirmed RLS enabled and forced on all 21 public tables.
- Local Supabase inspection confirmed 47 public RLS policies across all public tables.
- Local Supabase inspection confirmed all tenant-scoped business tables expose `tenant_id`.
- Transacted local RLS negative case confirmed a user from the demo tenant cannot read or update a property created under another tenant.
- Local RLS negative case confirmed a `viewer` cannot insert a property in its own tenant.

## Tasks

### SEC-001 - RLS Policy Review For Critical Tables

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Project Leader / Technical Lead, Architecture and Multitenancy, Backend / Security, QA Engineer / Test Agent

Problem:

Tenant isolation depends on critical database tables enforcing RLS correctly. Before a customer-facing pilot, the team needs to verify policies for reads and writes on tenant-scoped data.

Scope:

- Review migrations and current policies for critical tables.
- Cover `tenants`, `tenant_users`, `user_profiles`, `platform_users`, `properties`, `leads`, `pipeline_stages`, `lead_stage_history`, `conversations`, `conversation_messages`, `appointments`, `faqs`, `channels`, WhatsApp tables, `channel_events`, and `audit_logs`.
- Confirm `tenant_id` is present on business tables where expected.
- Confirm critical tables have RLS enabled or documented exceptions.
- Confirm service-role only or machine-to-machine paths are explicitly documented.
- Identify policies that are too broad, missing, or ambiguous.

Out of scope:

- Replacing the authorization model.
- Complete database redesign.
- External audit.

Acceptance criteria:

- Critical tables are classified as tenant-scoped, platform-scoped, profile/auth-scoped, or machine-to-machine.
- RLS status and intended access are documented for each critical table.
- Any missing or risky policy has a concrete follow-up task.

Verification:

- Static review of `supabase/migrations`.
- Local SQL/policy inspection if Supabase is available.
- Documented exceptions for service-role processing.

Completion notes:

- Verified RLS is enabled and forced on `appointments`, `audit_logs`, `automation_rules`, `channel_events`, `channel_whatsapp_accounts`, `channels`, `conversations`, `faqs`, `lead_property_interests`, `lead_stage_history`, `leads`, `messages`, `pipeline_stages`, `platform_users`, `properties`, `property_features`, `property_media`, `tenant_users`, `tenants`, `user_profiles`, and `whatsapp_message_templates`.
- Verified policies exist for every public table.
- Verified tenant-scoped business tables include `tenant_id`; `tenants`, `platform_users`, and `user_profiles` are intentionally scoped by table-specific rules instead.
- Verified a transacted cross-tenant property read/update attempt returns no rows for a tenant member from another tenant.
- Service-role processing is used for WhatsApp ingestion and invitation activation; this is intentional and constrained to machine-to-machine or admin workflows.

### SEC-002 - Server Action Permission Review

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

UI guards are not enough. Every critical mutation must validate authenticated user, active tenant, and role on the server.

Scope:

- Review server actions in `features/*/actions.ts`.
- Cover tenant settings, tenant users, platform tenants, properties, leads, conversations, appointments, FAQs, pipeline stages, WhatsApp templates, and retries.
- Confirm each mutation uses the expected server guard.
- Confirm tenant-scoped writes include `tenant_id` filters or tenant-owned insert values.
- Confirm delete operations are more restricted than update/create where intended.
- Confirm server-side parsing and validation are still present.

Out of scope:

- UI-only permission indicators unless they hide a server-side issue.
- Refactoring all actions into a new abstraction.

Acceptance criteria:

- Each critical action maps to a role/action matrix entry.
- No critical mutation relies only on UI guards.
- Any missing guard or weak tenant filter has a concrete follow-up task.

Verification:

- Static grep/review over action files.
- Targeted tests where existing test helpers make it practical.
- Manual negative-case checklist for actions not covered by tests.

Completion notes:

- Reviewed tenant, property, lead, conversation, appointment, FAQ, pipeline, and WhatsApp template actions.
- Critical mutations use domain-specific guards such as `requirePlatformAdmin`, `requireTenantAdminContext`, `requirePropertyWriteContext`, `requirePropertyDeleteContext`, `requireLeadWriteContext`, `requireLeadDeleteContext`, `requireConversationOperateContext`, `requireAppointmentWriteContext`, and `requireFaqManageContext`.
- Tenant-scoped update/delete paths reviewed include `tenant_id` filters or resolve the active tenant server-side.
- Cross-entity links for conversations and appointments validate that referenced leads, properties, advisors, and templates belong to the active tenant.
- No mutation relying only on UI permissions was found in this pass.

### SEC-003 - Route Protection And Active Tenant Review

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

Pages and route handlers must resolve authentication, active tenant, and role consistently. A route that renders or mutates data without the expected context can bypass product assumptions.

Scope:

- Review dashboard pages under `app/(dashboard)`.
- Review auth callback routes.
- Review public and webhook route handlers.
- Confirm pages that need active tenant call the appropriate tenant context helpers.
- Confirm platform-admin routes require platform admin context.
- Confirm role-restricted admin pages use server-side checks, not only sidebar visibility.
- Confirm active tenant cookie behavior does not allow access to unauthorized tenants.

Out of scope:

- Redesigning active tenant selection.
- Adding self-service tenant-switching features.

Acceptance criteria:

- Critical routes are classified as authenticated tenant, platform admin, public auth callback, or machine-to-machine.
- Each protected route has the expected server-side guard or documented reason.
- Active tenant assumptions are explicit.

Verification:

- Static review of `app` route/page files.
- Manual route-access checks with owner/admin/advisor/operator/viewer where practical.

Completion notes:

- Dashboard layout resolves authenticated app context on the server.
- Tenant dashboard pages use `getActiveTenantContext` or a stricter domain/page guard.
- Settings and channels pages apply server-side tenant admin checks when admin-only content is required.
- Platform tenant pages use `requirePlatformAdmin`.
- Auth callback uses a same-origin redirect helper and activates accepted invitations through the controlled service-role path.
- Active tenant selection ignores tenant cookie values that do not match one of the authenticated user's active memberships.

### SEC-004 - Cross-Tenant Negative Case Plan

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: Architecture and Multitenancy, Backend / Security, QA Engineer / Test Agent

Problem:

The pilot cannot proceed if one tenant can read or mutate another tenant's data. The team needs a concrete negative-case plan, even if not every case can be automated immediately.

Scope:

- Define cross-tenant read and write attempts for critical entities.
- Cover properties, leads, conversations, messages, appointments, FAQs, channels, templates, tenant users, and platform tenants.
- Include URL tampering cases for detail/edit pages.
- Include server action submission with IDs from a different tenant.
- Include active tenant cookie mismatch cases.
- Decide which cases should become automated tests and which remain manual for the pilot.

Out of scope:

- Full browser E2E suite.
- Fuzzing.
- External penetration testing.

Acceptance criteria:

- Cross-tenant negative cases are listed with expected outcomes.
- The plan distinguishes automated, manual, and deferred cases.
- Any discovered gap becomes a concrete bug task.

Verification:

- Execute representative negative cases locally or in staging.
- Add tests where low-cost and high-value.

Completion notes:

- Representative local SQL negative case was executed in a transaction: a property inserted under a second tenant was invisible and not updatable for a user from the demo tenant.
- Representative role negative case was executed locally: the seeded `viewer` cannot insert a property in the demo tenant.
- Existing code-level tenant filters cover detail/edit URL tampering for properties, leads, conversations, FAQs, and appointments by resolving records through the active tenant.
- Recommended future automation: add browser-level E2E tests for URL tampering and cross-tenant server action submissions before unsupervised customer use.

### SEC-005 - Role/Action Matrix Validation

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

The role/action matrix must reflect the actual implemented behavior. Drift between documentation, UI, and server guards creates confusion and security risk.

Scope:

- Validate the current role/action matrix against code.
- Cover platform admin, tenant owner, tenant admin, advisor, operator, and viewer.
- Include page visibility, primary UI actions, server actions, and route handlers.
- Confirm viewer restrictions are explicit.
- Confirm operator/advisor differences are intentional.
- Update documentation if behavior is correct but the matrix is stale.

Out of scope:

- Large role model redesign.
- New permission UI.

Acceptance criteria:

- Matrix is accurate and current.
- Any mismatch is classified as bug, documentation update, or product decision.
- Pilot roles are clearly documented.

Verification:

- Static code review.
- Manual checks with seed users where practical.

Completion notes:

- The role/action matrix matches `lib/permissions.ts`, `server/auth/tenant-context.ts`, server actions, and RLS policies.
- `viewer` remains read-oriented and is excluded from business mutations by helpers and RLS.
- `advisor` and `operator` can perform operational writes for properties, leads, conversations, and appointments.
- `operator` can manage FAQs; `advisor` cannot.
- Deletes for leads and properties remain limited to owner/admin roles.
- `platform_admin` remains globally privileged by design.

### SEC-006 - Public Endpoint And Webhook Boundary Review

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

Public endpoints and machine-to-machine webhooks have different trust boundaries than authenticated dashboard routes. They need focused review before pilot use, especially if real WhatsApp provider delivery is in scope.

Scope:

- Review WhatsApp webhook verification.
- Review signature validation and failure handling.
- Review service-role usage in webhook processing.
- Review webhook tenant/channel resolution.
- Review retry/idempotency expectations where present.
- Review auth callback and invitation activation boundaries.
- Document caveats around rate limiting and real provider credentials.

Out of scope:

- Full production-grade rate limiter.
- New provider integration.
- Real Meta approval sync.

Acceptance criteria:

- Public endpoints are listed with trust boundary, verification method, and caveats.
- Webhook processing does not rely on user context where machine-to-machine is expected.
- Any missing hardening is captured as follow-up work.

Verification:

- Static review of route handlers and webhook services.
- Existing tests for webhook payload/signature handling.
- Manual invalid-signature and invalid-payload checks where practical.

Completion notes:

- WhatsApp GET verification requires the configured verify token.
- WhatsApp POST enforces body size limits and validates JSON/schema before processing.
- WhatsApp POST verifies `x-hub-signature-256` when `WHATSAPP_APP_SECRET` is configured.
- Rejected webhook events are logged through service-role `channel_events` inserts with `tenant_id = null`.
- Webhook processing resolves tenant/channel by `phone_number_id`, writes through service-role paths, and records channel events for traceability and idempotency.
- Caveat: if `WHATSAPP_APP_SECRET` is absent, unsigned POST payloads are accepted. This is acceptable for local development, but must be configured for real provider traffic.

### SEC-007 - Security Review Exit Checklist

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, Backend / Security, QA Engineer / Test Agent

Problem:

The security review needs a clear exit decision. Without one, findings can remain ambiguous and the project may move to onboarding without knowing whether pilot exposure is acceptable.

Scope:

- Create a security review checklist.
- Summarize findings from `SEC-001` through `SEC-006`.
- Classify each finding as `pilot blocker`, `pilot caveat`, `non-blocker`, or `post-MVP`.
- Define go/no-go criteria for moving to `Real Tenant Onboarding`.
- Link unresolved items to backlog tasks.

Out of scope:

- External sign-off.
- Compliance certification.

Acceptance criteria:

- The team can make a clear go/no-go decision after the security review.
- Pilot blockers are explicitly resolved or the pilot is paused.
- Remaining caveats are documented for operational readiness.

Verification:

- Review checklist against completed security tasks.
- Confirm all findings have owner, classification, and next action.

Completion notes:

- `SEC-001` through `SEC-006` are completed for this review pass.
- No pilot blocker was found at code level.
- Pilot caveats are documented in `Review Result`.
- Go/no-go recommendation: proceed to `Real Tenant Onboarding` for a supervised pilot after confirming required environment variables, especially real WhatsApp webhook secret configuration if WhatsApp provider traffic is in scope.
- Remaining hardening items should stay classified as pilot caveats or post-MVP unless a real customer test exposes a concrete bug.
