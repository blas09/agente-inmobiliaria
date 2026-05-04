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
9. `P1` Pagination For Dense Operational Lists
10. `P1` Focused QA And Manual Review

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

## Pagination Analysis

The richer seed dataset makes pagination necessary before a production-like pilot. The goal should be to keep each operational list scannable, preserve filter state in the URL, and avoid loading unbounded tenant data into server-rendered pages.

Recommended priority:

- `P0 / P1`: `/dashboard/properties` needs pagination because the catalog is expected to grow quickly, status tabs now expose dense inventory segments, and the page uses a table that should stay bounded.
- `P0 / P1`: `/dashboard/leads` needs pagination because it is one of the main daily work queues, has status tabs plus search, and will grow continuously from WhatsApp and manual intake.
- `P1`: `/dashboard/conversations` needs pagination because it is an inbox-style list ordered by activity. It should eventually combine pagination with status tabs or inbox filters.
- `P1`: `/dashboard/appointments` needs pagination because status tabs reduce density, but each appointment card is still relatively tall.
- `P1`: `/dashboard/faqs` needs pagination once the FAQ library grows beyond a small editorial set. It may also benefit from category/status tabs later.
- `P1`: `/dashboard/channels?tab=templates` needs pagination for WhatsApp templates when the template library grows.
- `P1`: `/dashboard/channels?tab=incidents` needs pagination or a hard recent-event limit because channel events can grow fast and should not render unbounded history.
- `P2`: `/dashboard/platform/tenants` should get pagination before real platform operations with many tenants, but it is less urgent for a single-tenant pilot.
- `P2`: settings team and pipeline sections do not need pagination for MVP unless the team or pipeline becomes unusually large.
- `No pagination for now`: dashboard summary widgets and detail sublists should stay intentionally capped instead of paginated.

Implementation guidance:

- Add a shared server-side pagination helper for URL params, bounds, offsets, and page size.
- Add a shared server-side sorting helper based on per-screen allowlists.
- Prefer database-level `range` / `limit` / `order` plus total count over fetching all rows and slicing or sorting in UI.
- Preserve existing filters and tabs when changing page.
- Preserve sorting when changing page, filters, tabs, or search.
- Reset to page 1 when search, status, tab, or other filters change.
- Use conservative default page sizes: 12 for card grids, 20 for tables, 10 for tall appointment/conversation cards.
- Keep tenant filters in every paginated query.
- URL params should use safe defaults:
  - `page`: positive integer, default `1`
  - `sort`: allowlisted key per page
  - `direction`: `asc` or `desc`
  - `pageSize`: fixed by page or selected from a small allowlist

### PPP-010 - Server-Side Pagination And Sorting For Dense Operational Lists

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Project Leader / Technical Lead, Backend / Security, Frontend Engineer, UI/UX Specialist, QA Engineer / Test Agent

Problem:

After enriching the seed data, dense list pages can render too many records at once and become harder to scan. If pagination is implemented client-side, the app still loads unbounded tenant data and sorting would only apply to the current client slice, producing misleading results.

Decision:

Pagination and sorting must be server-side for MVP operational lists. The server query is the source of truth for filtering, ordering, total count, and page boundaries. The UI only reflects and changes URL state.

Scope:

- Add server-side pagination to:
  - `/dashboard/properties`
  - `/dashboard/leads`
  - `/dashboard/conversations`
  - `/dashboard/appointments`
  - `/dashboard/faqs`
  - `/dashboard/channels?tab=templates`
  - `/dashboard/channels?tab=incidents`
- Consider `/dashboard/platform/tenants` after the tenant list is expanded.
- Add server-side sorting where the list surface supports meaningful ordering:
  - properties: title, price, status, created/published date
  - leads: created date, name, qualification status, score
  - conversations: last message date, status, contact name
  - appointments: scheduled date, status, advisor/lead when practical
  - FAQs: created date, category, status
  - channel templates: name, status, updated date
  - channel incidents: created date, event type, processing status
  - platform tenants: name, slug, status, timezone
- Keep filters, tabs, search, pagination, sorting, and direction state in URL params.
- Add or reuse a small pagination UI component.
- Add or reuse sortable table/list header controls where appropriate.
- Update list queries to fetch bounded results with total counts and allowlisted ordering.
- Use page-specific safe defaults for initial sorting.

Out of scope:

- Infinite scroll.
- Client-side pagination or client-side sorting as source of truth.
- Client-side data fetching rewrite.
- Broad dashboard redesign.
- Advanced sorting or saved views.
- Arbitrary user-provided sort columns.

Acceptance criteria:

- Dense operational lists render a bounded number of rows/cards.
- Page navigation preserves active tab and filters.
- Sorting is applied by the database query, not by slicing/sorting already-loaded rows in the UI.
- Sorting applies to the full filtered dataset, not only to the visible page.
- Sort params are validated against an allowlist per screen.
- Invalid `page`, `sort`, `direction`, or `pageSize` params fall back safely.
- Tenant-scoped queries remain tenant-scoped.
- Empty states still work with filters and pages.
- Pagination UI communicates current page and total result count.
- Changing filters, tabs, or search resets to page 1.
- Changing page preserves filters, tabs, search, sort, and direction.

Verification:

- Run lint, typecheck, and focused tests.
- Add tests for pagination/sorting param parsing and allowlist behavior if implemented as shared helpers.
- Manually review dense seeded data for properties, leads, conversations, appointments, FAQs, channel templates, and channel incidents.

### PPP-002 - Lead Detail Page Density Reduction

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Commercial Domain, QA Engineer / Test Agent

Progress notes:

- 2026-05-04: Started implementation together with `PPP-003`.
- 2026-05-04: Completed lead detail density reduction with compact overview, focused operational sections, and progressive disclosure for secondary history.

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

Completion notes:

- Replaced repeated top metric/profile blocks with a single compact commercial overview.
- Kept routing and appointment scheduling available as primary operational forms.
- Moved notes, conversations, visits, and pipeline history into grouped sections with progressive disclosure.
- Preserved existing permission checks and server actions.
- Verification run: `pnpm lint`, `pnpm test`, `./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json`.

### PPP-003 - Advisor Dashboard Focus Pass

Status: `done`
Priority: `P0`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Commercial Domain, QA Engineer / Test Agent

Progress notes:

- 2026-05-04: Started implementation together with `PPP-002`.
- 2026-05-04: Completed advisor-focused dashboard view with assigned leads, assigned conversations, upcoming visits, and reduced admin reporting density.

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

Completion notes:

- Added a role-aware advisor dashboard branch while keeping owner/admin dashboard behavior intact.
- Scoped advisor lead counts and recent lead lists to the authenticated advisor.
- Scoped advisor conversation and upcoming appointment data to the authenticated advisor where applicable.
- Added upcoming appointment data to dashboard summary for the advisor operational view.
- Verification run: `pnpm lint`, `pnpm test`, `./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json`.

### PPP-004 - Platform Admin Navigation Cleanup

Status: `done`
Priority: `P0`
Type: `bug`
Primary roles: Project Leader / Technical Lead, Frontend Engineer, Backend / Security, QA Engineer / Test Agent

Progress notes:

- 2026-05-04: Started platform admin navigation cleanup.
- 2026-05-04: Completed platform-only navigation behavior for platform admins without an active tenant role.

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

Completion notes:

- Updated `getSidebarItems` so platform admins without an active tenant role see only platform navigation.
- Preserved tenant navigation when a platform admin also has an active tenant membership.
- Kept tenant-role filtering for channels/settings unchanged.
- Added sidebar item unit tests for platform-only, platform-with-tenant, and non-admin tenant navigation.
- Verification run: `pnpm test -- tests/sidebar-items.test.ts`, `pnpm lint`, `pnpm typecheck`.

### PPP-005 - Channels Page Progressive Disclosure

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Integrations / WhatsApp, QA Engineer / Test Agent

Progress notes:

- 2026-05-04: Started channels page progressive disclosure pass.
- 2026-05-04: Completed channels page progressive disclosure and provider-state clarification.
- 2026-05-04: Reworked the page from nested expandable sections into URL-driven tabs to reduce visual nesting.

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

Completion notes:

- Added a provider-state summary that distinguishes operational readiness from pending WhatsApp provider validation.
- Replaced the nested expandable layout with tabs for `Estado`, `Plantillas`, `Nueva plantilla`, and `Incidentes`.
- Flattened tab content into rows and simple metric blocks to avoid card-within-card visual saturation.
- Kept template creation, template status actions, channel health, and incident review available without changing server actions.
- Verification run: `pnpm lint`, `pnpm typecheck`, `pnpm test`.

### PPP-006 - Settings Page Structure Cleanup

Status: `done`
Priority: `P1`
Type: `MVP`
Primary roles: UI/UX Specialist, Frontend Engineer, Backend / Security, QA Engineer / Test Agent

Progress notes:

- 2026-05-04: Started settings page tabbed structure cleanup following the validated channels pattern.
- 2026-05-04: Completed settings page tabbed structure for tenant, agenda, team, and pipeline sections.

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

Completion notes:

- Replaced the dense settings grid with URL-driven tabs for `Tenant`, `Agenda`, `Equipo`, and `Pipeline`.
- Kept the top metrics visible as orientation while separating each configuration domain into its own workspace.
- Flattened tenant, team, and pipeline read-only layouts into simple metric blocks and divided rows.
- Preserved admin-only checks, action sheets, tenant forms, appointment rules, user management, and pipeline forms.
- Verification run: `pnpm lint`, `pnpm typecheck`, `pnpm test`.

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

Status: `done`
Priority: `P1`
Type: `technical debt`
Primary roles: Commercial Domain, Project Leader / Technical Lead, QA Engineer / Test Agent

Progress notes:

- 2026-05-04: Started deterministic seed enrichment for realistic demo density.
- 2026-05-04: Completed richer deterministic seed dataset for the demo tenant.

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

Completion notes:

- Added more demo properties across sale/rent, property types, statuses, neighborhoods, prices, features, and advisors.
- Added more leads across qualification statuses, pipeline stages, sources, assignments, budgets, and handoff states.
- Added more conversations, messages, failed outbound examples, lead/property interests, appointments, stage history, FAQs, WhatsApp templates, and channel events.
- Kept data fake, deterministic, tenant-scoped, and credential-free.
- Verification run: `pnpm test -- tests/seed-uuids.test.ts tests/channel-health.test.ts`, `pnpm lint`, `pnpm typecheck`.
- Local database reset was not run automatically because it is destructive to the local database state.

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
