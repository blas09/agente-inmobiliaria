# Security And Permissions Review Backlog

Date: 2026-05-04

Status: proposed for review.

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

## Tasks

### SEC-001 - RLS Policy Review For Critical Tables

Status: `todo`
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

### SEC-002 - Server Action Permission Review

Status: `todo`
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

### SEC-003 - Route Protection And Active Tenant Review

Status: `todo`
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

### SEC-004 - Cross-Tenant Negative Case Plan

Status: `todo`
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

### SEC-005 - Role/Action Matrix Validation

Status: `todo`
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

### SEC-006 - Public Endpoint And Webhook Boundary Review

Status: `todo`
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

### SEC-007 - Security Review Exit Checklist

Status: `todo`
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
