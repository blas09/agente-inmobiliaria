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

Status: `todo`  
Priority: `P0`  
Type: `MVP`  
Primary roles: Product Owner, Project Leader / Technical Lead, Architecture and Multitenancy, Backend / Security, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P0`  
Type: `MVP`  
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, Backend / Security, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P0`  
Type: `MVP`  
Primary roles: Product Owner, Project Manager, Commercial Domain, Project Leader / Technical Lead, UI/UX Specialist, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P1`  
Type: `MVP`  
Primary roles: Commercial Domain, Project Leader / Technical Lead, Backend / Security, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P1`  
Type: `MVP`  
Primary roles: Product Owner, Commercial Domain, Project Leader / Technical Lead, Backend / Security, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P1`  
Type: `MVP`  
Primary roles: Product Owner, Commercial Domain, Project Leader / Technical Lead, Backend / Security, Frontend Engineer, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P1`  
Type: `MVP`  
Primary roles: Product Owner, Project Leader / Technical Lead, Integrations / WhatsApp, Backend / Security, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P1`  
Type: `technical debt`  
Primary roles: Project Leader / Technical Lead, Backend / Security, Integrations / WhatsApp, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P2`  
Type: `MVP`  
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

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

Status: `todo`  
Priority: `P2`  
Type: `technical debt`  
Primary roles: Project Leader / Technical Lead, Backend / Security, Integrations / WhatsApp, QA Engineer / Test Agent

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
