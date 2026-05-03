# Current Backlog

This file tracks what remains to close the scoped MVP and what should stay out of scope for now.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

Work must be classified as `MVP`, `bug`, `technical debt`, `post-MVP`, or `exploration` before implementation.

## Must Have for MVP

### 1. Permissions and Tenant Safety

Classification: `MVP`

- Harden permissions in server actions and feature-level mutations.
- Validate authenticated user, active tenant, and role on every critical write.
- Review negative cases for settings, channels, properties, leads, conversations, appointments, FAQs, and tenant users.

Done when:

- role-sensitive writes cannot be performed only by bypassing UI guards
- tenant-scoped mutations cannot cross tenant boundaries
- critical cases have focused tests or documented manual verification

### 2. Invitations and Memberships

Classification: `MVP`

- Finish the invitation flow enough for internal tests with real users.
- Make accepting invitations, role changes, suspension/removal, and invited state behavior clear.
- Improve multi-tenant membership handling only where it blocks MVP testing.

Done when:

- an admin can invite a user without manual database work
- the invited user can enter the tenant flow predictably
- owner/admin/advisor cases are manually verified

### 3. End-to-End Commercial Flow

Classification: `MVP`

- Make the main flow frictionless: property -> lead -> conversation -> visit -> follow-up.
- Ensure linking lead/conversation/property is clear and stable.
- Ensure pipeline/status changes are visible enough for advisors.

Done when:

- the full flow can be completed with seeded or test data without broken transitions
- the user can understand the next action from each detail screen
- obvious runtime errors in the main flow are fixed

### 4. Appointments as Internal Source of Truth

Classification: `MVP`

- Improve appointment visibility, advisor assignment, and status handling.
- Make basic availability/conflict expectations explicit inside the internal agenda.
- Keep Google Calendar out of scope for this cut.

Done when:

- users can create, confirm, cancel, and review visits by advisor
- appointment state is visible from the relevant lead/conversation context
- internal agenda behavior is clear enough for testing

### 5. Minimal Commercial Reporting

Classification: `MVP`

- Add basic reporting by advisor.
- Add basic reporting by pipeline/stage.
- Add basic response-time visibility.
- Add basic visit outcomes or appointment status visibility.

Done when:

- metrics match test data
- reports are useful for internal operational review
- no advanced dashboard redesign is required

### 6. WhatsApp Manual Operation Hardening

Classification: `MVP`

- Keep inbound/outbound reliable enough for supervised manual testing.
- Preserve event tracking, webhook rejection visibility, retries/manual retry, and template usage.
- Defer real Meta template approval/sync unless it becomes a pilot blocker.

Done when:

- inbound message, manual outbound, template send, retry/error, and invalid webhook cases are verified
- operational errors are visible enough to debug internal tests

### 7. Focused Regression Coverage

Classification: `technical debt`

- Add tests for MVP-critical permissions and tenant scoping.
- Add tests for WhatsApp payload handling where practical.
- Add tests for business-state transitions touched during MVP work.

Done when:

- critical changed paths have regression coverage or explicit manual verification
- `pnpm test` passes

## Should Have If It Does Not Block Must Have Work

- `[MVP]` Improve lead pipeline history visibility and auditability.
- `[MVP]` Improve lead search/filtering only where it blocks internal tests.
- `[technical debt]` Add structured logs for sensitive operations and external integrations.
- `[technical debt]` Add basic rate limiting/hardening for public endpoints.
- `[MVP]` Refine empty, error, loading, and transactional feedback states in the main commercial flow.

## Post-MVP

- Branding customization by tenant.
- Rich property media with Supabase Storage.
- Lead deduplication/merge beyond basic internal hygiene.
- Advanced filters and pagination.
- Real Meta approval/sync workflow for templates.
- Guided channel onboarding from UI.
- Advanced reports and management dashboards.
- Self-service tenant onboarding.

## Do Not Touch Yet

- Advanced AI.
- Billing.
- Full omnichannel support.
- Google Calendar integration.
- Large architecture rewrites.

## Recommended Execution Order

1. Permissions and tenant safety.
2. Invitations and memberships.
3. End-to-end commercial flow.
4. Appointments as internal source of truth.
5. Minimal commercial reporting.
6. WhatsApp manual operation hardening.
7. Focused regression coverage alongside each item above.
