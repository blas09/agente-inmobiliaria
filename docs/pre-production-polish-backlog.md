# Pre-Production Polish Backlog

Date: 2026-05-04

Status: active.

This grooming translates [Pre-Production Polish Requirements](./pre-production-polish-requirements.md) into an executable backlog.

The goal is to complete a focused UI/UX and demo-data polish pass before preparing a production-like pilot environment.

## Prioritization

- `P0`: needed before production-like pilot setup.
- `P1`: important for customer/demo confidence and operator usability.
- `P2`: useful polish that should not delay deployment preparation.
- `Post-MVP`: out of scope for this stage.

## Recommended Execution Order

1. `P0` UI/UX Audit For Target Screens
2. `P0` Lead Detail Page Density Reduction
3. `P0` Advisor Dashboard Focus Pass
4. `P0` Platform Admin Navigation Cleanup
5. `P1` Channels Page Progressive Disclosure
6. `P1` Settings Page Structure Cleanup
7. `P1` Public Commercial Index
8. `P1` Richer Demo Seed Dataset
9. `P1` Focused QA And Manual Review

## Tasks

### PPP-001 - UI/UX Audit For Target Screens

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: UI/UX Specialist, Product Owner, Project Leader / Technical Lead

Progress notes:

- 2026-05-04: Started UI/UX audit for target screens before implementation.
- 2026-05-04: Completed audit recommendations and implementation direction for the target screens.

Problem:

Several MVP screens are functionally useful but still feel overloaded before a customer-facing pilot.

Scope:

- Audit:
  - `/dashboard/leads/ffffffff-ffff-4fff-8fff-ffffffffffff`
  - `/dashboard/channels`
  - `/dashboard/settings`
  - `/dashboard` for advisor users
- Identify what should remain visible by default.
- Identify what should move behind tabs, drawers, sheets, sections, or progressive disclosure.
- Confirm priority actions per screen.
- Produce implementation recommendations before coding.

Out of scope:

- Broad visual redesign.
- New product features.
- Mobile-only redesign unless a blocking issue is found.

Acceptance criteria:

- Each target screen has a clear UX recommendation.
- Recommendations distinguish primary, secondary, and reference information.
- Implementation tasks can proceed without guessing layout intent.

Verification:

- Review recommendations against existing UI patterns.
- Confirm with Product Owner before implementation.

Completion notes:

### Lead Detail

Current issue:

- The page shows summary cards, profile, notes, routing, conversations, appointment creation, visit history, and pipeline history as one long operational surface.
- The same commercial state appears in multiple places.
- Appointment creation and lead routing are important actions but compete with secondary context.

Recommendation:

- Keep the lead identity, commercial status, assignment, stage, contact, and next action visible by default.
- Convert the page into a primary work area plus secondary sections.
- Use a compact overview at the top and move lower-priority reference material into grouped sections.
- Keep `LeadRoutingForm` and appointment creation available, but avoid showing every historical/reference block at equal weight.
- Recommended structure:
  - top summary: status, stage, advisor, contact, budget/zone
  - primary actions: edit, route/update status, schedule visit
  - operational tabs or section groups: `Operación`, `Conversaciones`, `Visitas`, `Historial`
  - pipeline history should be last or behind progressive disclosure

Implementation guidance for `PPP-002`:

- Prefer tabs or a segmented section layout over stacking all cards vertically.
- Remove repeated summary information where it appears both in top cards and profile card.
- Keep appointment scheduling near the primary workflow, not buried after secondary cards.

### Advisor Dashboard

Current issue:

- The dashboard is admin/reporting oriented and visually dense for advisors.
- Advisor users need to understand what to do next more than they need broad tenant context.

Recommendation:

- Keep owner/admin dashboard mostly intact.
- Add role-aware dashboard composition for advisor/operator users.
- For advisor, prioritize:
  - assigned active leads
  - pending human conversations
  - upcoming visits
  - follow-up/recent activity
- Deprioritize or hide admin-style sections such as tenant context, broad pipeline distribution, and management reporting for advisor users.

Implementation guidance for `PPP-003`:

- Use `activeMembership.role` to branch dashboard content.
- Avoid changing dashboard query behavior unless existing summary data is insufficient.
- If needed, reuse existing recent leads/conversations/appointments data first before adding new queries.

### Platform Admin Navigation

Current issue:

- Platform admins without an active tenant see tenant-operational nav items.
- Those routes then redirect because there is no active tenant context.

Recommendation:

- If `isPlatformAdmin` is true and `activeRole` is null/undefined, show only platform navigation.
- If a platform admin also has an active tenant membership, keep tenant navigation plus platform navigation.
- Apply the same behavior to desktop and mobile sidebar because both use the same item source.

Implementation guidance for `PPP-004`:

- Change `getSidebarItems` only.
- Do not weaken server-side route guards.
- Verify with `admin@platform.local` and tenant users.

### Channels

Current issue:

- Channel health, connected accounts, incident data, template creation, template list, metadata, and actions all appear at once.
- This is especially heavy while WhatsApp real provider is not configured.

Recommendation:

- Introduce clear sections for:
  - provider/channel state
  - operational health
  - templates
  - template actions/history
- Show real-provider caveat or simulated/manual expectation prominently when appropriate.
- Move template creation into an action sheet or compact action area.
- Keep recent incidents visible but avoid making them dominate when empty.

Implementation guidance for `PPP-005`:

- Prefer progressive disclosure for template create/edit/status actions.
- Keep channel health summary above details.
- Make provider state/caveat clearer than raw metrics when no real provider test has been performed.

### Settings

Current issue:

- Tenant data, agenda rules, users, and pipeline are all presented in one dense grid.
- User and pipeline editing can expand into a long operational page.

Recommendation:

- Split settings into clearer groups:
  - `Tenant`
  - `Agenda`
  - `Equipo`
  - `Pipeline`
- Tabs are a good fit because these are peer configuration domains.
- Keep high-level summary cards at the top only if they help orientation; otherwise reduce them.
- Keep edit forms in sheets where already supported.

Implementation guidance for `PPP-006`:

- Add a small reusable tabs component or local tab UI if no existing component exists.
- Keep admin-only checks unchanged.
- Avoid nesting cards inside cards.

### Public Commercial Index

Current issue:

- `/` redirects to auth and does not explain the product.
- The product is not ready for self-service signup.

Recommendation:

- Build a public landing page for unauthenticated users with CTA to manual demo/contact.
- Authenticated users can still navigate to dashboard via a visible action.
- Messaging should focus on operational value for real estate agencies:
  - centralize property catalog
  - organize leads
  - manage conversations
  - schedule visits
  - track follow-up
- Do not promise automatic signup, billing, or self-service onboarding.

Implementation guidance for `PPP-007`:

- Keep it as a single page.
- Use Spanish commercial copy.
- Include login/dashboard CTA.
- If no backend contact flow is approved, CTA should be mailto/contact placeholder or manual demo CTA without persistence.

### Richer Seeds

Current issue:

- Existing seed data is too small to reveal layout density and operational behavior under realistic use.

Recommendation:

- Add enough deterministic fake data to populate:
  - dashboard reports
  - lead lists and detail relations
  - multiple conversation states
  - appointment statuses
  - FAQ categories
  - channel event failures/successes
  - WhatsApp template statuses
- Keep one tenant as the main demo tenant unless cross-tenant UX needs a second tenant.

Implementation guidance for `PPP-008`:

- Keep UUIDs valid and deterministic.
- Avoid real credentials.
- Keep data volume realistic but not excessive: enough to stress UI, not thousands of rows.

### QA Direction

Recommended checks for `PPP-009`:

- Owner/admin:
  - lead detail
  - channels
  - settings
  - dashboard
- Advisor:
  - dashboard
  - lead detail
  - restricted settings/channels nav behavior
- Platform admin:
  - sidebar shows platform-only navigation when there is no tenant role
  - platform tenants route works
- Unauthenticated:
  - public index renders
  - login path remains reachable
- Data:
  - richer seeds reset cleanly
  - seed UUID tests pass

### PPP-002 - Lead Detail Page Density Reduction

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Commercial Domain, QA Engineer / Test Agent

Problem:

The lead detail page combines profile, routing, conversations, appointments, notes, and pipeline history in a long page. It is useful, but too dense for pilot use.

Scope:

- Reduce initial vertical load.
- Keep the main commercial state and next action visible.
- Reorganize secondary sections such as pipeline history, context, appointments, and conversations.
- Preserve lead routing and appointment creation.
- Keep Spanish UI copy.

Out of scope:

- Changing lead business logic.
- Adding new lead fields.
- Reworking all lead pages.

Acceptance criteria:

- The page is easier to scan on first load.
- The next commercial action is clear.
- Secondary information remains accessible.
- No existing permission behavior changes.

Verification:

- Manual check as owner/admin and advisor/operator.
- Validate route `/dashboard/leads/ffffffff-ffff-4fff-8fff-ffffffffffff`.
- Confirm lead routing and appointment scheduling still work.

### PPP-003 - Advisor Dashboard Focus Pass

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Commercial Domain, QA Engineer / Test Agent

Problem:

The dashboard can feel overloaded for advisor users. Advisors need a more focused operational view than admins.

Scope:

- Review dashboard content for advisor role.
- Prioritize assigned leads, pending conversations, upcoming visits, and follow-up actions.
- Reduce admin-style reporting density for advisor users where appropriate.
- Keep admin/owner dashboard behavior intact unless explicitly improved.

Out of scope:

- New analytics modules.
- Full personalized dashboard builder.
- Changing reporting queries unless required for existing data display.

Acceptance criteria:

- Advisor dashboard emphasizes actionable work.
- Admin-level context is reduced or deprioritized for advisor.
- Existing dashboard metrics still work for admin roles.

Verification:

- Manual check as advisor.
- Manual check as tenant owner/admin.
- Confirm no role loses required access.

### PPP-004 - Platform Admin Navigation Cleanup

Status: `todo`
Priority: `P0`
Type: `bug`
Primary roles: Project Leader / Technical Lead, Frontend Engineer, Backend / Security, QA Engineer / Test Agent

Problem:

Platform admins without an active tenant see tenant-operational menu options that redirect to `/dashboard/platform/tenants` because they lack active tenant context.

Scope:

- Hide tenant-operational navigation when `isPlatformAdmin` is true and there is no active tenant role.
- Show only platform-relevant navigation in that state.
- Keep tenant navigation visible when a platform admin is also operating inside a tenant membership.
- Apply consistently to desktop and mobile sidebar.

Out of scope:

- Changing server-side route protections.
- Adding tenant switching UX.
- Changing platform admin permissions.

Acceptance criteria:

- Platform admin without active tenant sees only platform-relevant navigation.
- Clicking visible nav items no longer causes permission-context redirect loops.
- Tenant users still see appropriate tenant navigation.

Verification:

- Manual check as `admin@platform.local`.
- Manual check as tenant owner/admin/advisor.

### PPP-005 - Channels Page Progressive Disclosure

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Integrations / WhatsApp, QA Engineer / Test Agent

Problem:

The channels page exposes health, channel details, template creation, template list, and template actions at once. This is dense, especially before real WhatsApp provider setup.

Scope:

- Reduce initial cognitive load.
- Make simulated/manual versus real provider caveats clearer.
- Group channel health, connected accounts, templates, and actions more deliberately.
- Keep template management available for admin roles.

Out of scope:

- Real Meta setup automation.
- New provider integration.
- Changing template business logic.

Acceptance criteria:

- Page clearly communicates current channel/provider state.
- Template management is usable without dominating the page.
- WhatsApp real-provider caveats are clear when relevant.

Verification:

- Manual check as tenant owner/admin.
- Confirm template create/status actions still work.
- Confirm channel health still renders with richer seed data.

### PPP-006 - Settings Page Structure Cleanup

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Backend / Security, QA Engineer / Test Agent

Problem:

Settings combines tenant configuration, agenda rules, users, and pipeline in one dense page.

Scope:

- Improve section hierarchy.
- Consider tabs, grouped sections, or progressive disclosure.
- Keep tenant, agenda, users, and pipeline workflows accessible.
- Preserve admin-only behavior.

Out of scope:

- Changing tenant setup model.
- Adding self-service onboarding.
- Changing membership or pipeline logic.

Acceptance criteria:

- Settings is easier to scan and operate.
- Admin-only actions remain available only to allowed roles.
- User and pipeline editing remain functional.

Verification:

- Manual check as tenant owner/admin.
- Confirm non-admin role access behavior remains unchanged.

### PPP-007 - Public Commercial Index

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, Commercial Domain

Problem:

The root page currently redirects to auth. There is no public commercial explanation of the platform.

Scope:

- Create a public commercial index for unauthenticated visitors.
- Explain the value proposition for real estate agencies.
- Present the core workflow:
  `properties -> leads -> conversations -> visits -> follow-up`.
- Include CTA for manual demo/contact.
- Preserve authenticated access path to dashboard.
- Avoid promising self-service signup.

Out of scope:

- Public signup.
- Billing.
- Lead capture backend unless explicitly approved.
- Marketing site with many pages.

Acceptance criteria:

- Unauthenticated visitors can understand what the product does.
- CTA does not imply automatic tenant creation.
- Authenticated users can still access dashboard.
- Copy is Spanish and commercially clear.

Verification:

- Manual check unauthenticated `/`.
- Manual check authenticated navigation to `/dashboard`.
- Review copy with Product Owner/Commercial Domain.

### PPP-008 - Richer Demo Seed Dataset

Status: `todo`
Priority: `P1`
Type: `technical debt`
Primary roles: Commercial Domain, Project Leader / Technical Lead, QA Engineer / Test Agent

Problem:

Current seeds are too small to evaluate realistic density, lists, dashboards, and detail pages.

Scope:

- Add more deterministic demo data for the existing demo tenant.
- Include:
  - more properties
  - more leads across stages/statuses
  - more conversations and messages
  - more appointments across statuses
  - more FAQs
  - channel events and template states where useful
- Preserve tenant isolation and valid UUIDs.
- Avoid real credentials or sensitive data.

Out of scope:

- Import tooling.
- Random data generation at runtime.
- Additional tenants unless required for cross-tenant UX checks.

Acceptance criteria:

- Local reset produces a richer operational dataset.
- Dashboard and target pages show realistic density.
- Seed UUID validity tests remain green.
- Demo data is clearly fake.

Verification:

- Run seed UUID tests.
- Reset local database when practical.
- Manual review target pages with richer data.

### PPP-009 - Focused QA And Manual Review

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: QA Engineer / Test Agent, Project Manager, Product Owner

Problem:

The polish pass must be verified by role and target route before moving back to production-like environment setup.

Scope:

- Define and run manual checks for:
  - lead detail
  - channels
  - settings
  - advisor dashboard
  - platform admin navigation
  - public index
  - richer seeds
- Run focused automated checks.
- Classify remaining issues.

Out of scope:

- Full browser E2E suite unless explicitly approved.
- Production deployment.

Acceptance criteria:

- Target pages are reviewed with appropriate roles.
- No P0 polish/regression issue remains.
- Remaining issues are classified before moving to deployment setup.

Verification:

- Run relevant automated tests.
- Manual role walkthrough with owner/admin, advisor, platform admin, and unauthenticated visitor.
