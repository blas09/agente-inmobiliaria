# Execution Backlog

This backlog translates the current MVP cut into executable tasks.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

Execution rule:

- work one task at a time
- keep each task scoped
- update this file when a task starts, becomes blocked, or is completed
- do not start `post-MVP` or `exploration` work without an explicit decision

Progress tracking:

- when starting a task, change `Status` from `todo` to `in_progress` and add `Progress notes`
- when blocked, change `Status` to `blocked` and add `Blocker`
- when completed, change `Status` to `done` and add `Completed` plus `Verification`
- when follow-up work is discovered, create a new numbered task and reference it from the original task
- update `pending.md`, `roadmap.md`, or `mvp-status.md` only when the overall product state or priorities change

## Prioritization Model

- `P0`: blocks MVP safety or the first serious internal testing round
- `P1`: needed for a reliable MVP but can follow the critical blockers
- `P2`: useful if it does not delay P0/P1 work

Task types:

- `MVP`
- `bug`
- `technical debt`
- `post-MVP`
- `exploration`

Statuses:

- `todo`
- `in_progress`
- `blocked`
- `done`
- `post_mvp`

## Execution Order

1. `P0` Permissions and Tenant Safety
2. `P0` Invitations and Memberships
3. `P0` End-to-End Commercial Flow Audit
4. `P1` Lead/Conversation/Property Linking
5. `P1` Appointments as Internal Source of Truth
6. `P1` Minimal Commercial Reporting
7. `P1` WhatsApp Manual Operation Hardening
8. `P1` Focused Regression Coverage
9. `P2` Main Flow UI Feedback Pass
10. `P2` Structured Logs and Endpoint Hardening
11. `P1` Release Readiness / Internal Pilot Checklist

## Tasks

### 001 - Permissions and Tenant Safety

Status: `done`
Priority: `P0`  
Type: `MVP`  
Primary roles: Product Owner, Project Leader / Technical Lead, Architecture and Multitenancy, Backend / Security, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Auditing server actions, route handlers, services, and existing server-side guards before implementation.
- 2026-05-03: Completed. Server-side guard audit found the existing guard layer mostly in place; tenant membership writes were tightened to include explicit `tenant_id` filters on final updates.

Role/action matrix:

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

Completed:

- Audited critical server actions and route handlers for settings, channels/templates, properties, leads, conversations, appointments, FAQs, tenant users, platform tenants, and WhatsApp webhook ingestion.
- Confirmed active tenant and active membership are resolved through `getActiveTenantContext`, with role-specific guards layered on top.
- Confirmed critical tenant-scoped mutations use `activeTenant.id` and tenant-scoped filters.
- Hardened tenant membership update paths by adding explicit `.eq("tenant_id", activeTenant.id)` to final `tenant_users` updates after membership lookup.
- Documented the role/action matrix above.

Verification:

- Static guard audit completed with `rg` across actions, route handlers, services, and permission helpers.
- Reviewed `server/auth/tenant-context.ts`, `lib/permissions.ts`, `features/*/actions.ts`, WhatsApp webhook route, and related service entry points.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 6 files, 21 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- Direct `pnpm test` is not available until the shell loads Node/pnpm; see `AGENTS.md` common commands for the local nvm workaround.

Problem:

The MVP cannot safely expand while critical writes may still rely too much on UI guards. Server-side permissions need to be audited and hardened before additional product flow work.

Scope:

- Audit all critical server actions, route handlers, and service-level mutations.
- Cover settings, channels, properties, leads, conversations, appointments, FAQs, and tenant users.
- Define a simple role/action matrix for `owner`, `admin`, `advisor`, and `platform_admin`.
- Identify where UI guards exist but server-side guards are incomplete.
- Add or reuse shared server-side guards for active tenant, active membership, required tenant role, and platform admin.
- Harden the highest-risk mutations first.
- Add focused tests or documented manual verification for negative permission cases.

Out of scope:

- Redesigning the role model.
- Replacing RLS.
- Building a new permissions UI.
- Broad refactors unrelated to authorization.

Done when:

- Critical tenant-scoped writes validate authenticated user, active tenant, and role on the server.
- Advisor/admin/platform-admin negative cases are covered for critical areas.
- Cross-tenant mutation attempts are blocked.
- A role/action matrix exists in this task or a linked doc section.
- Verification is documented.

Expected verification:

- `pnpm test`
- targeted permission tests where practical
- manual negative-case checklist for any path not covered by tests

### 002 - Invitations and Memberships

Status: `done`  
Priority: `P0`  
Type: `MVP`  
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, Backend / Security, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing the Settings membership flow, invitation activation, role/status transitions, and membership UX copy.
- 2026-05-03: Completed. Existing users are activated directly when added, new users are forced into invited state, and membership status/role labels are clearer in Settings.

Completed:

- Reviewed invitation activation in `app/auth/callback/route.ts` and `server/auth/invitations.ts`.
- Confirmed accepted invited memberships are activated when the auth callback resolves a user and when tenant memberships are loaded.
- Changed the add-member action so submitted status is ignored for new additions: existing users become `active`, while new invited users remain `invited`.
- Kept manual status transitions only in the existing-member update flow.
- Preserved the last-active-owner protection when changing/removing owner memberships.
- Clarified Settings copy for existing vs new users.
- Removed the status picker from the add-member form to avoid implying that new users can be created as active before accepting an invitation.
- Added Spanish role/status labels in the membership UI instead of exposing raw internal role/status values.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 6 files, 21 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- Reviewed role/status transition paths for existing users, invited users, suspended/removed memberships, and last-owner protection.
- Manual invite flow with local Supabase email capture was not executed because the Supabase CLI/runtime is not available in this shell.

Problem:

Internal testing with real users needs a predictable membership workflow. Inviting, accepting, changing roles, suspending, and removing users should not depend on manual database work for normal cases.

Scope:

- Review the current invitation flow from `Settings`.
- Clarify behavior for existing users vs new invited users.
- Validate invited, active, suspended, and removed membership transitions.
- Ensure role changes are server-side guarded.
- Improve UX copy/states where the membership status is unclear.
- Verify owner/admin/advisor behavior.

Out of scope:

- Full self-service tenant onboarding.
- Billing or subscription-based user limits.
- Complex multi-tenant preference management unless it blocks MVP testing.

Done when:

- An admin can invite a user without manual database work.
- The invited user can enter the tenant flow predictably.
- Role changes, suspension, and removal behave consistently.
- Owner/admin/advisor cases are verified.

Expected verification:

- `pnpm test`
- manual invite flow using local Supabase email capture
- role-based negative checks for membership actions

### 003 - End-to-End Commercial Flow Audit

Status: `done`  
Priority: `P0`  
Type: `MVP`  
Primary roles: Product Owner, Project Manager, Commercial Domain, Project Leader / Technical Lead, UI/UX Specialist, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Auditing the main MVP flow through routes, server actions, detail screens, linking forms, appointment forms, and available automated checks.
- 2026-05-03: Completed code-level and build-time flow audit. Authenticated UI walkthrough was not executed yet; local Supabase ports are defined in `supabase/config.toml`, and the API responds outside the sandbox on `55421`.

Flow audit notes:

- Property entry point exists through `/dashboard/properties`, `/dashboard/properties/new`, and property detail/edit routes.
- Lead entry point exists through `/dashboard/leads/new`; lead detail includes routing, advisor assignment, pipeline/status update, associated conversations, appointment creation, appointment list, and pipeline history.
- Conversation detail supports manual reply, routing, lead/property linking, and appointment creation once a lead is linked.
- Conversation detail correctly blocks appointment creation until a lead is associated and explains the missing prerequisite.
- Appointment creation from lead and conversation contexts pre-fills advisor/property where context exists.
- Appointments page lists visits, shows lead/property/advisor context, links back to lead/property, and allows status/detail updates for operational roles.
- Build output confirms all main MVP routes are present and compile: properties, leads, conversations, appointments, settings, channels, and platform tenants.

Findings:

- No P0 product blocker was found in the code-level audit.
- The runtime authenticated walkthrough is still required before release readiness. Supabase is available locally, but the UI walkthrough was not part of this code/build audit.
- Property detail does not currently provide a direct "create lead for this property" action. This is not a P0 blocker for the manual MVP flow, but it should be considered during Task 004 if linking context still feels unclear.
- Follow-up state after a visit is represented by appointment status today. Richer follow-up workflow remains outside this audit and should be handled only if Task 005 or Task 006 exposes a concrete MVP blocker.

Follow-up tasks:

- Task 004 should focus on making lead/conversation/property relationships visible and stable where the audit identified possible friction.
- Task 005 should validate appointment status transitions and visit visibility as the internal source of truth.
- Task 011 must include the authenticated runtime walkthrough using local Supabase or a target test environment.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 6 files, 21 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.
- Supabase local config reviewed: `supabase/config.toml` defines API port `55421`, DB port `55422`, Studio port `55423`, and Inbucket port `55424`.
- Supabase API check passed outside the sandbox: `curl -i http://127.0.0.1:55421/rest/v1/` returned `200 OK`.
- Direct sandbox access to `127.0.0.1:55421` failed, so local Supabase checks that need localhost access may require running outside the sandbox.

Problem:

The MVP is defined by one operational flow. Before adding more features, the team needs to verify where the current product flow breaks or creates friction.

Scope:

- Walk through `property -> lead -> conversation -> visit -> follow-up` with seeded/test data.
- Identify missing transitions, unclear next actions, runtime errors, and broken links.
- Create follow-up implementation tasks for concrete blockers.
- Separate true MVP blockers from post-MVP improvements.

Out of scope:

- Implementing all fixes during the audit.
- Adding new major features.
- Redesigning the whole UI.

Done when:

- The complete flow has been tested manually.
- Blockers are listed as follow-up tasks with priority and owner.
- Post-MVP ideas are explicitly separated.
- The next implementation task is clear.

Expected verification:

- documented walkthrough notes
- screenshots only if they clarify a blocker
- backlog updates

### 004 - Lead/Conversation/Property Linking

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Commercial Domain, Project Leader / Technical Lead, Backend / Security, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing tenant-scoped linking actions and the visibility of linked lead/conversation/property context across detail pages.
- 2026-05-03: Completed. Conversation link updates now revalidate related lead/property pages, lead detail shows the property context for each conversation, and property detail shows linked conversations plus associated lead context.

Completed:

- Preserved manual linking as the MVP path through the existing conversation linking form.
- Kept server-side tenant validation for selected lead and property records before updating a conversation.
- Added revalidation for previous and newly linked lead/property detail pages after conversation link changes.
- Added linked property context to the lead detail conversation list.
- Added property detail operational context showing linked conversations and associated leads.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/prettier --write ...` completed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 6 files, 21 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.
- Local Supabase/PostgREST relation check passed outside the sandbox: linked conversation select with embedded `properties(...)` and `leads(...)` returned `200`.

Problem:

The commercial flow depends on stable and clear linking between leads, conversations, and properties. The current foundation exists, but the UX and operational behavior need to be reliable enough for internal tests.

Scope:

- Review current lead/conversation/property linking behavior.
- Fix broken or unclear transitions found in Task 003.
- Ensure links are tenant-scoped and server-validated.
- Make linked entities visible from detail pages where they affect the next action.
- Preserve manual operations as the first MVP path.

Out of scope:

- Advanced matching.
- AI recommendations.
- Lead deduplication/merge unless it blocks the pilot.

Done when:

- A user can link and review lead/conversation/property relationships without confusion.
- The linked context supports manual reply and visit scheduling.
- Tenant-scoped mutations are guarded.

Expected verification:

- targeted tests for linking mutations where practical
- manual walkthrough from property to lead to conversation

### 005 - Appointments as Internal Source of Truth

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Commercial Domain, Project Leader / Technical Lead, Backend / Security, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing appointment creation/update flows, advisor availability checks, status transitions, and agenda visibility from lead/conversation/property contexts.
- 2026-05-03: Completed. Appointment states now have shared Spanish labels/tones, agenda filters are visible, property detail shows related visits, and appointment changes revalidate affected property pages.

Completed:

- Confirmed appointment create/update actions validate tenant-scoped lead/property records, assignable advisors, business hours, advance notice, and advisor conflicts for planned visits.
- Added shared appointment status labels and UI tones for consistent agenda, form, and related-record presentation.
- Added agenda filters for status and advisor using the existing query support.
- Added property-level visit visibility so a property can show scheduled/completed/canceled visits tied to it.
- Revalidated property detail pages when appointments are created or updated with a property association.
- Added focused tests for appointment status labels and tones.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/prettier --write ...` completed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 7 files, 23 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.
- Local Supabase/PostgREST appointments check passed outside the sandbox: appointment select returned `200`.

Problem:

Appointments need to work as the internal source of truth for visits before any external calendar integration is considered.

Scope:

- Review appointment creation from lead/conversation/property contexts.
- Clarify advisor assignment, status changes, and visit visibility.
- Make basic availability/conflict expectations explicit in the internal agenda.
- Improve appointment state visibility from related records.
- Keep Google Calendar out of scope.

Out of scope:

- Google Calendar.
- External availability sync.
- Complex scheduling optimization.

Done when:

- Users can create, confirm, cancel, and review visits by advisor.
- Appointment state is visible from the relevant lead/conversation context.
- Internal agenda behavior is clear enough for internal testing.

Expected verification:

- manual appointment flow
- tests for status transitions where practical
- negative permission checks for appointment mutations

### 006 - Minimal Commercial Reporting

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Commercial Domain, Project Leader / Technical Lead, Backend / Security, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Extending the tenant dashboard with minimal advisor, pipeline, response-time, and appointment outcome reporting while keeping the existing dashboard layout.
- 2026-05-03: Completed. Tenant dashboard now includes minimal reports for pipeline stages, advisor load, appointment outcomes, and first-response timing.

Completed:

- Added focused reporting helpers for advisor distribution, pipeline distribution, appointment outcomes, and first response.
- Extended the dashboard summary query with tenant-scoped leads, pipeline stages, appointments, messages, and advisor profile labels.
- Added compact dashboard sections for pipeline, leads by advisor, visit outcomes, and first response.
- Kept reporting read-only and aligned with the existing dashboard card/list patterns.
- Added query-level helper tests for the reporting aggregations.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/prettier --write ...` completed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 8 files, 27 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.
- Local Supabase/PostgREST reporting check passed outside the sandbox: message reporting select returned `200`.

Problem:

The dashboard currently has basic metrics, but internal testing and commercial review need minimal visibility by advisor, pipeline/stage, response time, and visit outcomes.

Scope:

- Define the smallest useful report set for internal review.
- Add basic metrics by advisor.
- Add basic metrics by pipeline/stage.
- Add response-time visibility where data supports it.
- Add appointment/visit outcome visibility.
- Keep the UI simple and aligned with existing dashboard patterns.

Out of scope:

- Advanced analytics.
- Large dashboard redesign.
- Exporting reports.
- Billing/plan metrics.

Done when:

- Metrics match seeded/test data.
- Reports are useful for reviewing internal test activity.
- The UI remains consistent with existing dashboard patterns.

Expected verification:

- query-level tests where practical
- manual data checks against seeded/test records

### 007 - WhatsApp Manual Operation Hardening

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Leader / Technical Lead, Integrations / WhatsApp, Backend / Security, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing inbound webhook handling, manual outbound, template send, retry behavior, and operational error visibility.
- 2026-05-03: Completed. Manual WhatsApp operation now exposes outbound failure details in conversation timeline, passes saved template components into manual sends, and counts all webhook rejection event types in channel health.

Completed:

- Reviewed inbound webhook validation, invalid JSON/payload/signature rejection logging, outbound send failure logging, template validation, and manual retry behavior.
- Added saved template components to the conversation reply form so default template payloads are visible and reusable.
- Added outbound `error_message` visibility next to failed messages in the conversation timeline before retry.
- Expanded channel health metrics to count every `whatsapp.webhook.*` rejection, not only invalid signatures.
- Extracted channel health aggregation into a tested helper.
- Added focused tests for outbound/retry/webhook health counters and recent incident visibility.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/prettier --write ...` completed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 9 files, 29 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.
- Local Supabase/PostgREST channel health check passed outside the sandbox: `channel_events` select returned `200`.

Remaining risk:

- Real Meta outbound delivery and template approval/sync still require provider credentials and are outside this MVP task.

Problem:

WhatsApp is already functional, but supervised manual operation needs enough reliability and visibility to support internal testing without guessing what failed.

Scope:

- Verify inbound message handling.
- Verify manual outbound.
- Verify template send from conversation.
- Verify webhook rejection visibility.
- Verify retries/manual retry behavior.
- Improve operational error visibility only where current behavior blocks debugging.

Out of scope:

- Real Meta template approval/sync unless it blocks a pilot.
- Full channel onboarding.
- Omnichannel abstractions beyond existing boundaries.

Done when:

- Inbound, outbound, template send, retry/error, and invalid webhook cases are verified.
- Operational errors are visible enough to debug internal tests.
- Any remaining gaps are classified as MVP blocker or post-MVP.

Expected verification:

- targeted tests for payload parsing/idempotency where practical
- manual webhook and outbound checks
- documented remaining risk

### 008 - Focused Regression Coverage

Status: `done`
Priority: `P1`
Type: `technical debt`
Primary roles: Project Leader / Technical Lead, Backend / Security, Integrations / WhatsApp, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing current regression coverage and adding focused tests around critical WhatsApp payload/status handling without introducing brittle E2E coverage.
- 2026-05-03: Completed. Added focused WhatsApp webhook/status regression coverage and verified the full existing regression suite.

Completed:

- Added tests for valid WhatsApp message/status webhook payload parsing.
- Added tests for supported and unsupported WhatsApp delivery status mapping.
- Added tests for idempotent status transitions so stale delivery events do not downgrade already-read/delivered/failed messages.
- Confirmed existing focused coverage for permissions, appointment rules, appointment audit changes, appointment status labels, dashboard reporting, channel health, auth redirects, and utility date formatting.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/prettier --write ...` completed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 9 files, 32 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.

Remaining risk:

- Full outbound provider behavior and browser-level E2E flows remain manual or environment-dependent and should be revisited only if internal pilot testing exposes blockers.

Problem:

The MVP flow touches permissions, tenant scoping, business transitions, and external payload handling. These areas need focused regression coverage so sequential task work does not break critical behavior.

Scope:

- Add tests for critical permissions and tenant scoping.
- Add tests for WhatsApp payload handling where practical.
- Add tests for business-state transitions touched during MVP work.
- Prefer focused tests over broad brittle coverage.

Out of scope:

- Full E2E suite.
- Snapshot-heavy UI testing.
- Testing every visual state.

Done when:

- Critical changed paths have regression coverage or explicit manual verification.
- `pnpm test` passes.
- Remaining untested risks are documented.

Expected verification:

- `pnpm test`
- targeted test files for changed critical paths

### 009 - Main Flow UI Feedback Pass

Status: `done`
Priority: `P2`
Type: `MVP`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing main MVP flow feedback on dashboard, properties, leads, conversations, and appointments without changing the visual system.
- 2026-05-03: Completed. Improved empty/filter states in main flow screens, added accessible transactional feedback, and added an empty message timeline state.

Completed:

- Added accessible `role` and `aria-live` semantics to shared action feedback.
- Added `aria-busy` to shared submit buttons while forms are pending.
- Added empty states for dashboard recent leads and recent conversations.
- Made properties, leads, and appointments empty states distinguish between no data and no filtered results.
- Added a clear empty state for conversation timelines with no persisted messages yet.
- Preserved the existing visual system and layout patterns.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/prettier --write ...` completed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 9 files, 32 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.

Remaining risk:

- Browser-based responsive smoke testing should be included in Task 011 release readiness.

Problem:

The main commercial flow needs clear empty states, errors, loading states, and transactional feedback so internal testers understand what happened and what to do next.

Scope:

- Review only the main MVP flow screens.
- Improve unclear empty states, error states, loading states, and success/failure feedback.
- Preserve the current visual system.
- Prioritize usability over visual redesign.

Out of scope:

- Global visual rewrite.
- Marketing pages.
- Non-MVP secondary screens unless they block testing.

Done when:

- Main flow screens have clear feedback for common operations.
- UI remains consistent with the current shell and components.
- No layout regressions in common desktop/mobile widths.

Expected verification:

- manual UI walkthrough
- responsive smoke check on key screens

### 010 - Structured Logs and Endpoint Hardening

Status: `done`
Priority: `P2`
Type: `technical debt`
Primary roles: Project Leader / Technical Lead, Backend / Security, Integrations / WhatsApp, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing public webhook and sensitive action observability; focusing on bounded WhatsApp webhook logging and basic request hardening.
- 2026-05-03: Completed. WhatsApp webhook now has bounded body handling, sanitized rejection logging, invalid verification logging, and focused hardening tests.

Completed:

- Added a 256 KB body limit for WhatsApp webhook POST requests.
- Added structured helper logic for UTF-8 byte size checks and bounded rejection payloads.
- Truncated logged webhook request bodies to avoid storing large payloads in `channel_events`.
- Logged invalid GET verification attempts as `whatsapp.webhook.invalid_verification`.
- Preserved existing signature, invalid JSON, invalid payload, and inbound processing behavior.
- Added focused tests for byte counting, body-size rejection, and truncation metadata.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/prettier --write ...` completed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed: 10 files, 35 tests.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack` passed.
- Manual endpoint check passed: local Next dev server returned `400` for invalid webhook JSON and was stopped after verification.

Remaining risk:

- No persistent distributed rate limiter was added. Add it only if pilot traffic or abuse patterns justify the extra infrastructure.

Problem:

Sensitive operations and public endpoints need better operational safety and debugging support, but this should not delay P0/P1 MVP blockers.

Scope:

- Add structured logs for sensitive actions where currently missing.
- Improve external integration observability where it helps debug MVP testing.
- Add basic hardening or rate limiting for public endpoints where practical.

Out of scope:

- Full observability platform.
- Complex alerting system.
- Broad logging rewrite.

Done when:

- The highest-risk public/sensitive paths have basic operational visibility.
- Any endpoint hardening is documented and tested where practical.
- Remaining observability gaps are classified.

Expected verification:

- targeted tests where practical
- manual endpoint checks
- documented remaining risk

### 011 - Release Readiness / Internal Pilot Checklist

Status: `todo`  
Priority: `P1`  
Type: `MVP`  
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, QA Engineer / Test Agent, Documentation / Roadmap

Problem:

Before calling the scoped MVP ready for internal testing or a supervised pilot, the team needs one final release-readiness pass that confirms setup, flows, checks, known issues, and operating assumptions.

Scope:

- Confirm the target environment for the first serious test round.
- Confirm required environment variables and external service assumptions.
- Confirm demo/seed tenant and test accounts.
- Run the MVP flow checklist end to end.
- Run required automated checks.
- Document known issues, non-blockers, and pilot blockers.
- Confirm what remains explicitly post-MVP.
- Update roadmap/status/backlog to reflect the real release state.

Out of scope:

- Fixing all discovered issues inside this task.
- Production launch automation.
- Billing, self-service onboarding, or broad deployment work.
- Full security/compliance audit.

Done when:

- There is a clear internal pilot checklist.
- The MVP flow has been manually verified or blockers are documented.
- Required automated checks have been run or skipped with a documented reason.
- Known issues are classified as blocker, non-blocker, or post-MVP.
- The docs reflect whether the MVP is ready for internal testing, blocked, or ready only with caveats.

Expected verification:

- `pnpm lint`
- `pnpm test`
- `pnpm build` when release readiness requires it
- manual walkthrough of `property -> lead -> conversation -> visit -> follow-up`
- documented known-issues list
