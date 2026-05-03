# UI/UX MVP Polish Backlog

Date: 2026-05-03

Status: approved for execution.

This grooming covers the next project stage defined in [MVP Path To Customer Use](./mvp-path.md): `UI/UX MVP Polish`.

The goal is not to redesign the product. The goal is to make the existing MVP clearer, more consistent, and safer for a supervised customer pilot.

## Grooming Scope

Reviewed areas:

- authenticated shell and navigation
- dashboard
- properties list, detail, and form
- leads list, detail, and form
- conversations list and detail
- appointments
- FAQs
- channels and WhatsApp templates
- settings, users, appointment rules, and pipeline stages
- shared components for page headers, empty states, feedback, tables, cards, and forms

Out of scope for this stage:

- new product features
- billing
- self-service onboarding
- advanced AI
- new external integrations
- architecture changes
- full rebrand

## Prioritization

- `P0`: blocks a supervised customer pilot or creates strong user confusion in a critical flow.
- `P1`: needed for a consistent MVP customer experience.
- `P2`: visual polish or secondary usability improvement.
- `Post-MVP`: useful, but should not be part of this UI/UX polish pass.

## Recommended Execution Order

1. `P0` Customer-Facing Spanish Labels
2. `P0` Critical Flow Orientation And Actions
3. `P1` Search And Filter Usability
4. `P1` Feedback, Empty, Error, And Loading State Consistency
5. `P1` Conversation Workspace Polish
6. `P1` Appointment UX Polish
7. `P1` Form Structure And Field Help
8. `P1` Responsive And Mobile Polish
9. `P2` Visual System Cleanup
10. `P2` Secondary Admin Screen Polish

UI/UX Specialist decision:

- approve the backlog with sequencing adjustments
- start with `UI-002` because raw English enum/status values reduce trust and clarity for Spanish-speaking pilot users
- keep `UI-004`, `UI-005`, and `UI-006` separate because they touch different workflows
- keep `UI-007` as a later pass because earlier UI tasks can change responsive layouts
- keep `UI-009` and `UI-010` as lower-priority polish/admin work

## Tasks

### UI-001 - Critical Flow Orientation And Actions

Status: `done`
Priority: `P0`
Type: `UI/UX`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing critical flow pages for clearer page purpose, next action, and related-record navigation.
- 2026-05-03: Completed. Added clearer page context, more consistent primary edit actions, and small continuity links in the critical commercial flow.

Completed:

- Added concise page descriptions to dashboard, properties, leads, conversations, appointments, channels, FAQs, settings, create, edit, and detail screens.
- Clarified the role of properties, leads, conversations, visits, and settings inside the MVP flow.
- Standardized edit actions on property and lead detail pages to use button styling instead of plain text links.
- Added continuity wording/links from appointments and conversations back to the related lead flow.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.

Problem:

The core MVP flow exists, but each screen does not always make the next operational action obvious. A customer user should understand where they are in `property -> lead -> conversation -> visit -> follow-up` without needing prior product knowledge.

Scope:

- Add concise page descriptions or contextual subtitles where currently missing.
- Make the primary action on each critical screen visually consistent.
- Ensure detail pages expose the next useful action clearly: edit, link, route, schedule, reply, or review.
- Review dashboard, properties, leads, conversations, appointments, and detail screens.
- Keep UI copy in Spanish.

Out of scope:

- New workflow logic.
- New data fields.
- New navigation sections.

Acceptance criteria:

- Each critical screen has a clear purpose and next action.
- Primary actions use a consistent visual treatment.
- Secondary actions do not compete visually with the primary action.
- Detail pages make related records easy to reach.

Verification:

- Manual walkthrough: property -> lead -> conversation -> visit -> follow-up.
- Desktop and mobile review.
- Screenshot review for the six critical screens.

### UI-002 - Customer-Facing Spanish Labels

Status: `done`
Priority: `P0`
Type: `UI/UX`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Auditing customer-facing enum/status output before adding shared Spanish label helpers.
- 2026-05-03: Completed. Added shared Spanish UI label helpers and replaced raw customer-facing values across the critical MVP surfaces.

Completed:

- Added shared UI label helpers for properties, leads, conversations, channels, tenants, memberships, roles, FAQs, pipeline categories, WhatsApp templates, messages, and providers.
- Replaced raw visible statuses and enum-like values in dashboard, properties, leads, conversations, appointments, channels, FAQs, settings, and platform tenant screens.
- Updated form options so user-facing choices remain in Spanish while submitted values stay unchanged.
- Updated WhatsApp template user-facing copy from raw "template" wording to Spanish "plantilla" where shown to users.
- Added focused regression coverage for shared label helpers.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run tests/ui-labels.test.ts` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.

Problem:

Several customer-facing surfaces still expose internal enum values or English terms such as `available`, `pending_human`, `sale`, `rent`, `delivered`, `read`, `inactive`, and `default`. This creates avoidable friction for Spanish-speaking users.

Scope:

- Replace visible enum/status values with Spanish labels.
- Cover properties, leads, conversations, appointments, channels, templates, settings, and dashboard summaries.
- Centralize label maps when labels are reused.
- Keep internal code and identifiers in English.

Out of scope:

- Changing database enum values.
- Translating source code identifiers.
- Full i18n framework.

Acceptance criteria:

- No critical customer-facing screen exposes raw internal enum values.
- Reused statuses share the same label across screens.
- Badges and filters use the same user-facing wording.
- UI remains Spanish while code remains English.

Verification:

- Manual screen review.
- `rg` check for known raw enum values in UI output paths where practical.
- Existing tests continue passing if shared label helpers are introduced.

### UI-003 - Search And Filter Usability

Status: `done`
Priority: `P1`
Type: `UI/UX`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing existing query-param filters and the read-only global header search before adding visible controls.
- 2026-05-03: Completed. Added visible section-level filters and removed the inactive global search affordance.

Completed:

- Added visible search and status filters to the properties list using existing query parameters.
- Added visible search and commercial-status filters to the leads list using existing query parameters.
- Added a clear-filter action to the appointments filter bar.
- Removed the read-only global search input from the dashboard header so users do not see a non-functional search control.
- Kept active-filter empty states differentiated between no data and no matching results.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.

Problem:

Some pages support filters through query params, but the UI does not always expose clear filter controls. The global header search is read-only, which can look broken or misleading.

Scope:

- Add visible filter/search controls to list pages where server queries already support them.
- Cover properties and leads first.
- Review appointments filters for consistency with the same pattern.
- Decide whether the header search should be removed, disabled with clearer affordance, or scoped to a useful route-level search later.
- Add clear "limpiar filtros" behavior where filters are active.

Out of scope:

- Global full-text search.
- Advanced filters and pagination.
- Saved views.

Acceptance criteria:

- Users can discover and use existing filters without editing the URL.
- Active filters are visually obvious.
- Empty states differentiate between no data and no results.
- Header search no longer appears as a broken interactive control.

Verification:

- Manual list-page filtering checks.
- Query string behavior review.
- Mobile layout review for filter controls.

### UI-004 - Conversation Workspace Polish

Status: `done`
Priority: `P1`
Type: `UI/UX`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Reviewing the conversation detail workspace to clarify context, reply, routing, linking, agenda, and message timeline.
- 2026-05-03: Completed. Reorganized the conversation detail into a clearer reply/timeline workspace with an operational context column.

Completed:

- Reordered the conversation detail layout so manual reply and message timeline are the primary workspace.
- Moved context, routing, linking, agenda, and lead-visit history into a separate operational column.
- Improved message timeline readability with direction/status badges and clearer metadata.
- Made failed outbound messages visually distinct and kept retry actions close to the failed message.
- Added short descriptions to reply, routing, and linking forms.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.

Problem:

The conversation detail screen is functionally powerful but dense. Routing, linking, scheduling, manual replies, and message history compete for attention.

Scope:

- Reorganize conversation detail into clearer operational zones.
- Make message timeline more readable and closer to a conversation workspace.
- Clarify pending human, AI state, advisor, linked lead, and linked property.
- Make failed outbound retry affordances easy to find without dominating normal messages.
- Preserve all current capabilities.

Out of scope:

- Real-time chat.
- New message composer capabilities.
- New AI behavior.

Acceptance criteria:

- A user can identify conversation status, linked lead/property, assigned advisor, and next action within a few seconds.
- Timeline messages are visually scannable.
- Reply and retry actions are visually distinct from configuration forms.
- The page remains usable on mobile.

Verification:

- Manual conversation detail walkthrough.
- Failed message visual state review using seeded or mocked state if available.
- Desktop and mobile screenshots.

### UI-005 - Appointment UX Polish

Status: `todo`
Priority: `P1`
Type: `UI/UX`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Problem:

Appointments are operational, but date/time handling, rules, status changes, and repeated edit forms can feel heavy for a user trying to manage visits.

Scope:

- Improve appointment form hierarchy and helper text.
- Make active rules easier to scan.
- Make appointment status labels consistent and Spanish across all screens.
- Review the agenda list so each visit reads as a compact operational item.
- Avoid layout overload when many appointments exist.

Out of scope:

- Calendar view.
- Google Calendar integration.
- Complex advisor availability.

Acceptance criteria:

- Creating a visit from lead/conversation is clear.
- Updating a visit from agenda is clear.
- Rules and timezone are understandable without overwhelming the form.
- Agenda remains scannable with multiple visits.

Verification:

- Manual create/update/cancel appointment flow.
- Review validation error state.
- Desktop and mobile layout check.

### UI-006 - Form Structure And Field Help

Status: `todo`
Priority: `P1`
Type: `UI/UX`
Primary roles: UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Problem:

Property and lead forms contain many fields with limited grouping, prioritization, and helper text. This can slow down first-time users and make required vs optional data unclear.

Scope:

- Group property form into business basics, price, location, characteristics, description, and attributes.
- Group lead form into contact, commercial interest, budget/location, routing, and notes.
- Add short helper text only where it reduces ambiguity.
- Standardize checkbox groups visually.
- Keep submit and feedback placement consistent.

Out of scope:

- Multi-step wizards.
- New validation rules unless required for clearer errors.
- New fields.

Acceptance criteria:

- Forms are easier to scan.
- Required fields are visually clear.
- Optional groups do not dominate the first viewport.
- Checkbox groups match the visual system in light and dark mode.

Verification:

- Manual create/edit property.
- Manual create/edit lead.
- Validation error review.
- Mobile form review.

### UI-007 - Responsive And Mobile Polish

Status: `todo`
Priority: `P1`
Type: `UI/UX`
Primary roles: UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Problem:

The app has responsive foundations, but some dense CRM screens and table/list areas need a focused mobile and tablet pass before customer use.

Scope:

- Review mobile shell, sidebar sheet, header, spacing, and action placement.
- Review tables and list cards on small screens.
- Review detail pages with metric cards and two-column layouts.
- Ensure text does not overflow buttons, cards, badges, or form controls.
- Ensure fixed-width table content has usable horizontal scrolling or card fallback.

Out of scope:

- Native mobile app.
- Full mobile redesign.
- Gesture-specific interactions.

Acceptance criteria:

- Core pages are usable at mobile width.
- Primary actions are reachable.
- Tables/lists do not create confusing overflow.
- Long Spanish labels do not break buttons or badges.

Verification:

- Manual browser responsive checks.
- Screenshots for mobile and desktop.
- Check conversations, leads, properties, appointments, and settings.

### UI-008 - Feedback, Empty, Error, And Loading State Consistency

Status: `done`
Priority: `P1`
Type: `UI/UX`
Primary roles: UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Progress notes:

- 2026-05-03: Started. Auditing shared feedback, empty states, route loading behavior, and destructive actions.
- 2026-05-03: Completed. Standardized empty/search states, added safer destructive submits, and added a dashboard route loading state.

Completed:

- Replaced the generic empty-state initials with consistent icons and added a search-specific empty state tone.
- Applied the search empty-state tone to filtered no-result states in properties, leads, and appointments.
- Added a shared confirmation submit button for destructive form actions.
- Added confirmation prompts to visible delete actions for properties, leads, and FAQs.
- Added a route-level loading skeleton for the authenticated dashboard area.
- Kept existing inline action feedback behavior but tightened the shared feedback presentation.

Verification:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .` passed.
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json` passed.

Problem:

Shared feedback exists, but visual treatment and placement are not fully consistent. Some empty states use generic branding, some inline empty messages are plain text, and destructive actions lack a stronger safety pattern.

Scope:

- Standardize `EmptyState` icon/tone and actions.
- Use `ActionFeedback` consistently near affected forms.
- Review destructive actions for confirmation or safer affordance.
- Add route-level loading states where slow server pages would otherwise feel blank.
- Review error copy in Spanish.

Out of scope:

- Toast notification system unless needed by existing patterns.
- Full optimistic UI.
- New modal system unless required for delete confirmations.

Acceptance criteria:

- Empty states feel intentional and task-specific.
- Success/error feedback appears where users expect it.
- Delete actions are harder to trigger accidentally.
- Slow route transitions have acceptable feedback where practical.

Verification:

- Manual create/edit/delete flows where available.
- Validation error review.
- Empty data or filtered no-results review.

### UI-009 - Visual System Cleanup

Status: `todo`
Priority: `P2`
Type: `UI/UX`
Primary roles: UI/UX Specialist, Frontend Engineer

Problem:

The project mixes several card wrappers, badge variants, icon sources, and spacing patterns. The result is serviceable, but continued feature work could make the UI drift.

Scope:

- Review `Card`, `CardBox`, metric cards, dashboard cards, badges, buttons, and page headers.
- Standardize spacing between page sections.
- Align card radius, border, background, and header spacing.
- Prefer one icon system per surface where practical.
- Keep changes scoped to visible polish.

Out of scope:

- Replacing the component library.
- Full design token rewrite.
- Full Tailwind template migration.

Acceptance criteria:

- Similar surfaces look and behave similarly.
- Page spacing feels consistent across main routes.
- Badge and button variants are used predictably.
- No broad component churn unrelated to visible polish.

Verification:

- Visual review across main routes.
- Lint and typecheck.

### UI-010 - Secondary Admin Screen Polish

Status: `todo`
Priority: `P2`
Type: `UI/UX`
Primary roles: Product Owner, UI/UX Specialist, Frontend Engineer, QA Engineer / Test Agent

Problem:

Channels, templates, settings, tenant users, pipeline stages, and platform tenant screens are important but secondary for the first customer pilot. They need enough clarity to support supervised operation without absorbing the whole UI polish phase.

Scope:

- Improve information hierarchy in channels and template status management.
- Clarify settings sections and reduce visual overload.
- Review tenant user role/status labels.
- Review pipeline stage edit density.
- Review platform tenant screens for admin usability.

Out of scope:

- Self-service onboarding.
- Real Meta approval workflow.
- Advanced admin analytics.

Acceptance criteria:

- Admin screens are understandable for a supervised operator.
- Critical settings are easy to identify.
- Secondary controls do not distract from primary setup tasks.

Verification:

- Manual settings and channels walkthrough.
- Admin role walkthrough where relevant.

## Post-MVP UI/UX Items

These should not be included in this polish pass unless a customer pilot explicitly requires them:

- Full global search.
- Calendar view for visits.
- Guided onboarding wizard.
- Tenant branding customization.
- Rich property media gallery.
- Advanced reporting dashboards.
- Saved filters and table customization.
- Real-time conversation updates.
- Full i18n system.

## Grooming Result

Recommended decision:

- review this backlog with the user before implementation
- after approval, execute tasks sequentially starting with `UI-001`
- update task status in this file as work starts and completes
- avoid adding new features during this phase unless a `P0` customer-pilot blocker is discovered
