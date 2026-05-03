# Project Roadmap

Status legend:

- `[x]` Done
- `[~]` Partial / foundation implemented
- `[ ]` Pending

## Current MVP Cut - 2026-05-03

The scoped MVP should validate one complete commercial operation for a real estate agency:

`property -> lead -> conversation -> visit -> follow-up`

The goal is not to keep expanding features. The goal is to make this flow reliable enough for disciplined internal testing and a first supervised commercial pilot.

### Must Have

1. `[MVP]` Harden tenant user permissions in server actions and feature-level mutations.
   - Done when critical writes validate authenticated user, active tenant, and role on the server.
   - Verification: role-based negative cases for settings, channels, properties, leads, conversations, appointments, FAQs, and tenant users.
2. `[MVP]` Close the invitation and membership workflow enough for real internal testing.
   - Done when inviting, accepting, suspending/removing, and role changes are clear and do not depend on manual database work for normal cases.
   - Verification: owner/admin/advisor flows with at least one invited user.
3. `[MVP]` Make the commercial flow frictionless from property to visit.
   - Done when a user can create/select a property, create or receive a lead, link a conversation, reply, move pipeline/status, and schedule a visit without broken transitions.
   - Verification: full manual walkthrough with seeded tenant data.
4. `[MVP]` Make appointments operational enough for internal use.
   - Done when appointments have clear visibility, advisor assignment, status changes, and basic conflict/availability expectations within the internal agenda.
   - Verification: create, confirm, cancel, and review appointments by advisor.
5. `[MVP]` Add minimal commercial reporting.
   - Done when the dashboard or reports expose activity by advisor, pipeline/stage, response time, and visit outcomes at a basic level.
   - Verification: metrics match seeded/test data.
6. `[MVP]` Keep WhatsApp reliable for manual supervised operation.
   - Done when inbound, outbound, template usage, event tracking, retries/manual retry, and error visibility are sufficient for internal tests.
   - Verification: webhook rejection, inbound message, manual outbound, template send, and retry/error cases.
7. `[technical debt]` Add focused regression coverage for MVP-critical logic.
   - Done when critical permissions, tenant scoping, WhatsApp payload handling, and business-state transitions have tests where practical.
   - Verification: `pnpm test`, plus targeted tests for touched areas.

### Should Have

- `[MVP]` Improve lead pipeline history visibility and auditability.
- `[MVP]` Improve lead search/filtering where it blocks internal testing.
- `[technical debt]` Add structured logs for sensitive operations and external integrations.
- `[technical debt]` Add basic rate limiting/hardening for public endpoints.
- `[MVP]` Refine UI empty/error/loading states in the main commercial flow.

### Post-MVP

- Branding customization by tenant.
- Rich property media with Supabase Storage.
- Lead deduplication/merge beyond basic internal hygiene.
- Advanced filters and pagination.
- Real Meta approval/sync workflow for templates.
- Guided channel onboarding from UI.
- Advanced reports and management dashboards.

### Do Not Touch Yet

- Advanced AI.
- Billing.
- Full omnichannel support.
- Google Calendar integration.
- Large architecture rewrites.

## Product North Star

- `[x]` Define the SaaS goal: centralize properties, leads, conversations, and commercial operations per tenant.
- `[x]` Define each real estate agency as an isolated tenant.
- `[x]` Define channels as customer-owned, with the platform providing the SaaS layer.
- `[x]` Define WhatsApp as the initial channel focus, with future channel expansion.
- `[x]` Define structured data as the source of truth.
- `[x]` Define that AI must not decide business truth.

## Phase 0 - Foundation / Setup

### Architecture and Base Decisions

- `[x]` Define the general project architecture.
- `[x]` Define the main bounded contexts.
- `[x]` Define the multitenant strategy from day one.
- `[x]` Define separation between UI, domain, data access, and integrations.
- `[x]` Define adapter strategy for channels and AI.
- `[x]` Document folder structure.
- `[x]` Document the refined data model.

### Base Project

- `[x]` Initialize Next.js with App Router.
- `[x]` Configure strict TypeScript.
- `[x]` Configure Tailwind CSS.
- `[x]` Prepare a shadcn/ui-compatible foundation.
- `[x]` Configure ESLint.
- `[x]` Configure Prettier.
- `[x]` Configure base testing with Vitest.
- `[x]` Configure development, build, lint, and test scripts.
- `[x]` Document environment variables.
- `[x]` Configure dedicated local Supabase ports for this repo.
- `[x]` Configure local Supabase Auth email capture.
- `[x]` Pin local frontend to `127.0.0.1:3003`.
- `[x]` Reserve dedicated analytics/vector ports for the local Supabase stack.

### Supabase and Database

- `[x]` Create `supabase/` structure.
- `[x]` Create initial SQL migration.
- `[x]` Create base domain enums.
- `[x]` Create identity and access tables.
- `[x]` Create tenants and memberships tables.
- `[x]` Create property tables.
- `[x]` Create lead tables.
- `[x]` Create conversation and message tables.
- `[x]` Create channel and WhatsApp tables.
- `[x]` Create FAQ tables.
- `[x]` Create pipeline and appointment tables.
- `[x]` Create audit log and channel event tables.
- `[x]` Create primary indexes.
- `[x]` Create generic `updated_at` trigger.
- `[x]` Create initial sync from `auth.users` to `user_profiles`.
- `[x]` Create development seed.
- `[x]` Complete local Auth seed with `auth.identities` for email/password login.
- `[x]` Align `auth.users` seed with the current local GoTrue shape.
- `[x]` Adjust Auth seed for non-insertable columns in the current local schema.
- `[x]` Create base local Supabase config.

### Security and Multitenancy

- `[x]` Define mandatory `tenant_id` for business entities.
- `[x]` Implement initial RLS.
- `[x]` Implement SQL helper `is_platform_admin`.
- `[x]` Implement SQL helper `is_tenant_member`.
- `[x]` Implement SQL helper `has_tenant_role`.
- `[x]` Implement SQL helper `shares_tenant_with_user`.
- `[x]` Force RLS on critical tables.
- `[~]` Harden fine-grained permissions by application use case.
- `[ ]` Review policies for machine-to-machine webhook and job operations.

### Auth and Tenant Context

- `[x]` Configure Supabase SSR server client.
- `[x]` Configure browser client.
- `[x]` Configure admin client.
- `[x]` Protect routes.
- `[x]` Implement login.
- `[x]` Implement logout.
- `[x]` Resolve authenticated user on the server.
- `[x]` Resolve active user memberships.
- `[x]` Resolve active tenant from cookie.
- `[x]` Allow active tenant switching in UI.
- `[~]` Prepare robust support for multi-tenant users and persistent user defaults.

### Initial UI

- `[x]` Create authenticated layout.
- `[x]` Create sidebar navigation.
- `[x]` Create header with active tenant and logout.
- `[x]` Create base authenticated dashboard.
- `[x]` Show minimal indicators.
- `[x]` Create base reusable UI components.
- `[x]` Resolve basic desktop-first responsive behavior.
- `[x]` Support `platform_admin` dashboard without active tenant.
- `[~]` Improve empty states, errors, and transactional feedback consistently.
  A shared feedback pattern already exists for forms and actionable empty states in dashboard, leads, properties, conversations, appointments, and tenants.
- `[~]` Improve the overall product visual quality: typography, color, spacing, hierarchy, and consistency.
  Shell, login, dashboard, properties, leads, conversations, settings, appointments, and platform/tenants have already been refreshed. Full consistency and transactional feedback still need final review.
- `[x]` Define a more intentional visual direction for the SaaS dashboard.
- `[~]` Review fonts, color tokens, and base component states.
  The new visual foundation is applied, core components are aligned, and the shell supports light/dark mode with `next-themes`. More dark-mode detail is still needed for alerts, empty states, loading states, and complex details.

### Documentation

- `[x]` Create initial README.
- `[x]` Document local setup.
- `[x]` Document seed credentials.
- `[x]` Document architecture.
- `[x]` Document data model.
- `[~]` Document development conventions and agent workflow in `AGENTS.md`.
- `[ ]` Document Vercel + Supabase deployment strategy.
- `[ ]` Document PR criteria.

## Phase 1 - Operational Commercial MVP

### Commercial UX / UI

- `[~]` Rework visual direction using TailwindAdmin Next.js as a shell and component reference.
  Adoption is partial: tokens, layout, navigation, tables, and forms. The app architecture was not migrated and the full template was not injected.
  The base was migrated to Tailwind 4, the real template shell pattern was adopted, and the main operational pages now use the same dashboard-style structure with `CardBox`, `ProfileWelcome`, and adapted `TopCards`.
- `[~]` Refine dashboard look and feel for a more professional and distinctive appearance.
- `[~]` Improve tables, forms, and cards with stronger visual hierarchy.
- `[~]` Migrate internal forms and secondary screens to the same visual system.
  FAQs, channels, platform tenants, appointment rules, tenant forms, tenant users, and pipeline stage forms are already aligned. Minor residual cleanup remains.
- `[~]` Finish replacing custom visual wrappers with copied template components.
- `[~]` Consolidate and clean up old visual-system remnants.
- `[~]` Align typography, cards, badges, and headings more closely with the template.
- `[~]` Review navigation, information density, and desktop readability.
- `[~]` Improve responsive behavior in key CRM views.
  Leads, conversations, properties, appointments, settings, login, and tenants have been reviewed; secondary screens and tablet/mobile details still need attention.
- `[~]` Make filters, empty states, and primary actions clearer and more usable.
  Leads, properties, and appointments already use real GET filters and actionable empty states. Extend the pattern only where it blocks MVP flow.

### Tenant Management

- `[~]` Tenant model implemented.
- `[~]` Role model implemented.
- `[~]` Tenant CRUD from UI for `platform_admin`.
- `[~]` Tenant detail page.
- `[x]` Tenant status changes.
- `[x]` Editable general tenant settings.
- `[ ]` Basic tenant branding. Post-MVP unless a pilot explicitly needs it.
- `[~]` More complete selector for multi-tenant users.

### Users and Permissions

- `[~]` Tables and roles implemented.
- `[~]` Tenant internal user CRUD.
- `[~]` Invite user by email.
  A first usable flow exists in `Settings`: if the email does not exist, Supabase sends an invitation and the membership remains `invited`. Onboarding acceptance and multi-tenant UX need tightening.
- `[x]` Add membership to tenant.
- `[x]` Change tenant role.
- `[x]` Suspend or remove member.
- `[x]` Access-management screen.
- `[~]` UI guards by role.
  First layer is done: sidebar filtered by role, `settings` and `channels` blocked for non-admins, and visible guards in properties, leads, FAQs, appointments, and conversations. Server actions and fine-grained feature permissions still need hardening.
- `[~]` Policies applied from application actions/services.

### Properties

- `[x]` Property list.
- `[x]` Create property.
- `[x]` Edit property.
- `[x]` Property detail.
- `[x]` Delete property.
- `[x]` Basic filters.
- `[~]` Structured forms for main data.
- `[ ]` Advisor assignment in UI.
- `[ ]` Real media with Supabase Storage. Post-MVP unless a pilot explicitly needs it.
- `[ ]` Richer feature loading. Post-MVP.
- `[ ]` Pagination and advanced filters. Post-MVP unless internal tests require it.
- `[ ]` Import from external systems. Post-MVP.

### Leads

- `[x]` Lead list.
- `[x]` Manual lead creation.
- `[x]` Edit lead.
- `[x]` Lead detail.
- `[x]` Delete lead.
- `[x]` Basic commercial status.
- `[x]` Pipeline stage selection.
- `[x]` Real advisor assignment from UI.
- `[~]` Visible stage-change history.
- `[ ]` Lead merge/deduplication. Post-MVP unless it blocks a pilot.
- `[ ]` More complete search and filters. MVP only where it blocks internal testing.

### Conversations and Messages

- `[x]` Base conversation model.
- `[x]` Base message model.
- `[x]` Conversation list.
- `[x]` Conversation detail with timeline.
- `[~]` Conceptual association to lead and property.
- `[~]` Real association and editing from UI.
- `[x]` Actionable human handoff from UI.
- `[x]` Assign conversation to advisor.
- `[x]` Manual reply from the platform.
- `[~]` More complete operational statuses.

### FAQs

- `[x]` FAQ list.
- `[x]` Create FAQ.
- `[x]` Edit FAQ.
- `[x]` Delete FAQ.
- `[x]` Active/inactive status.
- `[ ]` More complete search and categories. Post-MVP unless internal testing needs it.

### Channels

- `[x]` General channel model.
- `[x]` WhatsApp account-specific model.
- `[x]` Basic channels page.
- `[x]` Base WhatsApp webhook.
- `[ ]` Create channel from UI. Post-MVP unless a pilot needs it.
- `[ ]` Functional Meta account connection per tenant. Post-MVP unless it blocks a pilot.
- `[ ]` Channel state management and validations.
- `[ ]` Secure credential management per tenant.
- `[~]` Templates per tenant.

### Basic Reports

- `[x]` Minimal dashboard metrics.
- `[x]` Leads by source.
- `[x]` Active properties.
- `[x]` Open conversations.
- `[ ]` Report by advisor.
- `[ ]` Report by stage.
- `[ ]` Response-time report.

## Phase 2 - Initial Automation

### Qualification and Operations

- `[~]` `score` field modeled.
- `[~]` `qualification_status` field modeled.
- `[ ]` Automatic score rules. Post-MVP.
- `[ ]` Automatic qualification rules. Post-MVP.
- `[ ]` Lead tags. Post-MVP.
- `[x]` Editable pipeline from UI.
- `[ ]` Consistent pipeline history.

### Follow-Up and Templates

- `[~]` `automation_rules` model ready.
- `[ ]` Simple rules engine. Post-MVP.
- `[ ]` Initial event triggers. Post-MVP.
- `[ ]` Automatic inactivity follow-up. Post-MVP.
- `[~]` Message templates foundation.
- `[ ]` Automation pause/disable controls. Post-MVP.

### Appointments and Visits

Current decision:

- The internal agenda is the business source of truth for visits.
- Google Calendar is planned as a future availability/sync integration, not a replacement for `appointments`.

- `[x]` `appointments` model ready.
- `[x]` Basic appointments UI.
- `[~]` Create visit from lead or property.
- `[x]` Confirm/cancel visit.
- `[x]` Simple advisor view.
- `[x]` Internal appointment rules by tenant: timezone, default duration, buffers, and working hours.
- `[~]` Basic visit-change timeline and audit trail.
- `[ ]` Google Calendar integration mode: `internal agenda + availability`. Post-MVP.
- `[ ]` Google Calendar OAuth connection by tenant or user. Post-MVP.
- `[ ]` Availability lookup with `freeBusy`. Post-MVP.
- `[ ]` External event creation on internal visit confirmation. Post-MVP.
- `[ ]` Sync state between `appointments` and external events. Post-MVP.
- `[ ]` Reschedule/cancel strategy from system to Google. Post-MVP.

### Initial Reports

- `[ ]` Expanded commercial dashboard.
- `[ ]` Conversion by stage.
- `[ ]` Scheduled/completed visits.
- `[ ]` Qualified vs unqualified leads.

## Phase 3 - Advanced AI

### AI Layer

- `[x]` Base AI provider contract.
- `[x]` Conceptual separation between retrieval, business rules, and generation.
- `[ ]` Integrate real AI provider. Post-MVP.
- `[ ]` Environment-based AI provider config. Post-MVP.
- `[ ]` AI request observability. Post-MVP.

### Conversational Intelligence

- `[ ]` Intent interpretation.
- `[ ]` Structured extraction from messages.
- `[ ]` Automatic conversation summaries.
- `[ ]` Suggestions for advisors.
- `[ ]` Matching with similar properties.
- `[ ]` Natural replies based on real facts.
- `[ ]` Explicit fallback when information is missing.
- `[ ]` Anti-hallucination rules.

### Retrieval and Grounding

- `[ ]` Tenant-scoped property retrieval service.
- `[ ]` Tenant-scoped FAQ retrieval service.
- `[ ]` Grounded context construction for replies.
- `[ ]` Prioritize business rules over model output.

## Phase 4 - Omnichannel and Self-Service

### Self-Service Onboarding

- `[ ]` Self-service tenant signup.
- `[ ]` Initial onboarding wizard.
- `[ ]` Initial branding and commercial data setup.
- `[ ]` Team invitation during onboarding.

### Additional Channels

- `[ ]` Real email provider.
- `[ ]` Email inbox.
- `[ ]` Basic web widget.
- `[ ]` Instagram.
- `[ ]` Facebook leads.
- `[ ]` Facebook Messenger if applicable.

### SaaS Platform

- `[ ]` Billing.
- `[ ]` Plans and limits.
- `[ ]` Subscription restrictions.
- `[ ]` Platform observability and metrics.
- `[ ]` Audit center for platform admin.
- `[ ]` Support backoffice.

## WhatsApp Integration - Specific Track

### Foundation Done

- `[x]` Define that each tenant connects its own account.
- `[x]` Model WhatsApp account per tenant.
- `[x]` Model channel per tenant.
- `[x]` Model inbound/outbound events.
- `[x]` Provide base webhook.
- `[x]` Provide base adapter.

### Pending for Real Operation

- `[x]` Real Meta webhook validation.
  Validates `x-hub-signature-256` with `WHATSAPP_APP_SECRET`, rejects missing/invalid signatures, validates JSON and payload schema with Zod, and records rejections in `channel_events`.
- `[x]` Message payload parsing.
- `[x]` Idempotency by `external_event_id`.
- `[x]` Channel lookup by account or number.
- `[x]` Conversation creation or linking.
- `[x]` Lead creation or linking.
- `[x]` Inbound message persistence.
- `[x]` Real outbound send.
- `[x]` Persistence for sent/delivered/read statuses.
- `[~]` Error handling and retries.
  Outbound has timeout and retries for transient failures (`429` and `5xx`), manual retry from conversations is ready, and the Channels screen shows volume, failures, retries, and webhook rejections. More detailed per-attempt observability and alerts remain.
- `[~]` Templates and approvals per tenant.
  Foundation exists: table, policies, actions, queries, basic UI, manual send from conversations, and basic status controls. It stores who changed/approved a template and when, and shows it in Channels. Creation and usage UX already include preview and friendly component validation. Real Meta approval flow and advanced validation by component type remain post-MVP unless they block a pilot.

## Technical Quality and Operations

### Done

- `[x]` Strict TypeScript.
- `[x]` Zod validation in main forms.
- `[x]` Server-side query separation.
- `[x]` Small reusable base components.
- `[x]` Lint, test, and build scripts.
- `[x]` Lint verification.
- `[x]` Test verification.
- `[x]` Typecheck verification.
- `[x]` Build verification.

### Pending

- `[ ]` Integration tests.
- `[ ]` End-to-end tests.
- `[ ]` Centralized structured logs.
- `[ ]` More complete error boundaries.
- `[ ]` Action traceability from services.
- `[ ]` External integration observability.
- `[ ]` Rate limiting or hardening for public endpoints.

## Base Closure Backlog Before Scaling Features

- `[~]` Tenant CRUD from UI.
- `[x]` Tenant user CRUD from UI.
- `[x]` Real advisor assignment.
- `[x]` Actionable human handoff.
- `[x]` Functional WhatsApp inbound.
- `[x]` Functional WhatsApp outbound.
- `[~]` Operational lead/conversation/property linking.
- `[x]` Editable pipeline.
- `[~]` Basic appointments.
- `[ ]` Media storage. Post-MVP unless a pilot explicitly needs it.

## Summary by Stage

- `Phase 0`: mostly done.
- `Phase 1`: partially done; the domain foundation is implemented, but real operation is still pending.
- `Phase 2`: mostly pending, although the base model exists.
- `Phase 3`: only the abstraction is done.
- `Phase 4`: pending.
