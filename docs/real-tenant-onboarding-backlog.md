# Real Tenant Onboarding Backlog

Date: 2026-05-04

Status: proposed for review.

This grooming covers the next project stage defined in [MVP Path To Customer Use](./mvp-path.md): `Real Tenant Onboarding`.

The goal is to onboard the first real customer tenant in a repeatable, supervised way without expanding into self-service onboarding. This is an operational MVP phase, not a new product feature phase.

## Grooming Scope

Reviewed references:

- [MVP Path To Customer Use](./mvp-path.md)
- [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md)
- [Security And Permissions Review Backlog](./security-permissions-review-backlog.md)
- [Current MVP Status](./mvp-status.md)
- [Current Pending Work](./pending.md)

Out of scope for this stage:

- self-service tenant onboarding
- billing setup
- public signup
- automated bulk import unless the first pilot explicitly requires it
- custom tenant branding beyond existing supported fields
- production launch automation
- broad data model changes

## Prioritization

- `P0`: blocks onboarding the first real tenant for a supervised pilot.
- `P1`: needed for a consistent onboarding experience and lower pilot risk.
- `P2`: useful polish that should not block first tenant onboarding.
- `Post-MVP`: valuable later, but outside the first supervised pilot onboarding.

## Recommended Execution Order

1. `P0` Customer Data Intake Template
2. `P0` First Tenant Setup Checklist
3. `P0` Initial Users And Roles Plan
4. `P0` Initial Property Catalog Preparation
5. `P0` Appointment Rules And Pipeline Setup
6. `P1` FAQ And Customer Response Base Preparation
7. `P1` WhatsApp Channel Decision And Setup Plan
8. `P1` First Login And Active Tenant Verification
9. `P1` Onboarding Exit Checklist

## Current Baseline

The product already supports manual tenant creation, user invitations, role assignment, properties, leads, FAQs, appointment rules, pipeline stages, channels, WhatsApp templates, and tenant-scoped operation.

This phase should use the existing admin and settings surfaces instead of building self-service onboarding. Any data that cannot be loaded through existing UI or safe manual setup should become a focused task only if it blocks the first pilot tenant.

## Tasks

### RTO-001 - Customer Data Intake Template

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Commercial Domain

Problem:

The first real tenant cannot be configured repeatably unless required customer data is known before setup starts.

Scope:

- Define the required data intake template for the first customer.
- Include tenant identity, currency, timezone, users, roles, appointment rules, initial properties, FAQs, and WhatsApp decision.
- Separate required, optional, and post-MVP data.
- Define data quality rules before setup starts.

Out of scope:

- Building an upload/import UI.
- Supporting arbitrary external CRM exports.
- Collecting billing or contract data.

Acceptance criteria:

- Required customer data is listed in a single checklist/template.
- Optional data is clearly separated from required data.
- Missing required data blocks onboarding until resolved.
- The template can be used by a non-developer setup owner.

Verification:

- Review against the setup needs in `pilot-operations-runbook.md`.
- Dry-run the template with sample tenant data.

### RTO-002 - First Tenant Setup Checklist

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Project Manager, Project Leader / Technical Lead, Backend / Security

Problem:

Tenant setup must be repeatable and auditable enough for a supervised pilot. Ad hoc setup increases operational and security risk.

Scope:

- Define exact steps to create or configure the tenant.
- Include tenant name, slug, status, primary currency, locale, timezone, settings, and any supported branding fields.
- Define whether setup happens locally, staging, or production-like environment.
- Include setup owner, date, environment, and caveat tracking.
- Confirm security caveats from the security review before exposing real data.

Out of scope:

- Automated provisioning.
- Production deployment automation.
- Self-service tenant creation.

Acceptance criteria:

- A setup owner can follow the checklist without guessing the next step.
- The checklist records environment, tenant identifier, setup date, and open caveats.
- Setup does not require code changes unless a blocker is found.

Verification:

- Execute checklist against a local or staging tenant with sample data.
- Confirm the tenant appears correctly in the platform tenant list and active tenant context.

### RTO-003 - Initial Users And Roles Plan

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Backend / Security, QA Engineer / Test Agent

Problem:

The pilot needs a small but realistic role setup. Incorrect roles can either block users or expose restricted actions.

Scope:

- Define the minimum user set for the first real tenant.
- Require at least one `tenant_owner` or `tenant_admin`.
- Require at least one daily operator role: `advisor` or `operator`.
- Decide whether a `viewer` is useful for read-only validation.
- Confirm invitation vs existing-user flow.
- Define role verification checks after setup.

Out of scope:

- Large organization hierarchy.
- Custom roles.
- SSO.

Acceptance criteria:

- Initial users and intended roles are documented before invitations are sent.
- No tenant is left without an active owner/admin.
- Daily operators can access operational screens.
- Restricted role checks are verified after setup.

Verification:

- Login or invitation verification for each initial user where practical.
- Confirm owner/admin can access settings.
- Confirm advisor/operator can operate core flows.
- Confirm viewer cannot perform restricted writes if included.

### RTO-004 - Initial Property Catalog Preparation

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Commercial Domain, Project Manager, QA Engineer / Test Agent

Problem:

The pilot cannot validate the commercial flow without a usable initial property catalog.

Scope:

- Define the minimum number and type of properties needed for the first pilot.
- Define required fields for each property.
- Define optional fields that improve realism but should not block setup.
- Confirm property statuses and commercial availability.
- Decide whether data is real, anonymized, or sample data.

Out of scope:

- Rich media upload.
- Automated import.
- Advanced filters or property deduplication.

Acceptance criteria:

- Property intake data is complete enough to create the initial catalog.
- Each property has title, operation type, property type, status, currency/price expectation, and location summary.
- Customer-facing fields are written clearly enough for advisors/operators.
- The catalog supports at least one lead/conversation/visit walkthrough.

Verification:

- Properties appear in the tenant property list.
- Property detail screens show expected data.
- Properties can be selected from lead/conversation appointment flows.

### RTO-005 - Appointment Rules And Pipeline Setup

Status: `todo`
Priority: `P0`
Type: `MVP`
Primary roles: Commercial Domain, Project Manager, Project Leader / Technical Lead, QA Engineer / Test Agent

Problem:

Visits and lead progression depend on tenant-specific appointment rules and pipeline stages. Defaults may not match the first customer's operation.

Scope:

- Confirm working days, business hours, default visit duration, buffer, and advance notice.
- Confirm initial pipeline stages and default stage.
- Define whether the pilot uses the current default stages or customer-specific labels.
- Verify visit scheduling behavior after setup.

Out of scope:

- Complex advisor availability calendars.
- Google Calendar integration.
- Multi-pipeline support.

Acceptance criteria:

- Appointment rules reflect the customer's real pilot schedule.
- Pipeline stages are understandable for the customer team.
- A visit can be scheduled for a valid date/time.
- Invalid date/time feedback remains clear.

Verification:

- Create a test lead and schedule a visit.
- Confirm the visit appears in agenda, lead detail, and property detail.
- Confirm a known invalid schedule is rejected.

### RTO-006 - FAQ And Customer Response Base Preparation

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Commercial Domain, UI/UX Specialist

Problem:

FAQs help the team respond consistently during the pilot, but poor FAQ content can confuse users or customers.

Scope:

- Define required FAQ categories for the first pilot.
- Prepare initial Spanish customer-facing FAQ answers.
- Mark FAQs as active/inactive intentionally.
- Keep internal notes out of customer-facing answers.

Out of scope:

- Advanced AI answer generation.
- Multi-language FAQ management.
- Public knowledge base.

Acceptance criteria:

- Initial FAQs are usable by operators during conversations.
- Answers are written in Spanish and suitable for customer-facing use.
- Categories are simple and operationally useful.

Verification:

- FAQs appear in the tenant FAQ list.
- Operators can identify relevant answers quickly.

### RTO-007 - WhatsApp Channel Decision And Setup Plan

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Leader / Technical Lead, Integrations / WhatsApp, Backend / Security

Problem:

WhatsApp can either be part of the first real pilot or remain simulated/manual. This decision changes environment requirements and pilot risk.

Scope:

- Decide whether real Meta WhatsApp delivery is in scope for the first pilot.
- If in scope, confirm credentials, phone number ID, verify token, `WHATSAPP_APP_SECRET`, templates, and webhook reachability.
- If out of scope, document the manual/simulated expectation clearly.
- Confirm channel caveats from the security and operations docs.

Out of scope:

- Real Meta template approval/sync automation.
- New provider integration.
- Omnichannel expansion.

Acceptance criteria:

- WhatsApp pilot mode is explicitly decided: real provider, simulated, or out of scope.
- If real provider is in scope, required credentials and secrets are listed before setup.
- If real provider is out of scope, customer expectations are documented before the pilot.

Verification:

- Review channel setup screen and template data.
- If real provider is in scope, run a controlled inbound/outbound smoke test.
- If not in scope, verify the app surfaces expected caveats without promising real delivery.

### RTO-008 - First Login And Active Tenant Verification

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: QA Engineer / Test Agent, Project Manager, Backend / Security

Problem:

After setup, the team must verify that real users land in the correct tenant and can perform only their intended actions.

Scope:

- Define first-login checks for each initial role.
- Verify active tenant resolution.
- Verify navigation and restricted screens by role.
- Verify core read/write flows using customer-like data.

Out of scope:

- Full browser E2E suite.
- Testing every post-MVP role scenario.

Acceptance criteria:

- Owner/admin, advisor/operator, and optional viewer checks are documented.
- Active tenant is correct after login.
- Core flow can be completed with customer-like data.
- Restricted actions remain unavailable to roles that should not perform them.

Verification:

- Manual login walkthrough for each pilot role where practical.
- Record any issue as `pilot blocker`, `pilot degraded`, `non-blocker`, `post-MVP`, or `invalid/test-data`.

### RTO-009 - Onboarding Exit Checklist

Status: `todo`
Priority: `P1`
Type: `MVP`
Primary roles: Product Owner, Project Manager, Project Leader / Technical Lead, QA Engineer / Test Agent

Problem:

The project needs a clear exit decision before moving from onboarding to pilot readiness. Otherwise, setup issues can leak into the pilot.

Scope:

- Create an exit checklist summarizing data loaded, users verified, caveats accepted, and blockers resolved.
- Classify findings from `RTO-001` through `RTO-008`.
- Define go/no-go criteria for moving to `Pilot Readiness`.
- Link unresolved work to follow-up tasks.

Out of scope:

- Final pilot go/no-go decision.
- Post-pilot feedback planning.

Acceptance criteria:

- The team can clearly decide whether onboarding is complete.
- Pilot blockers are resolved or the pilot is paused.
- Accepted caveats are documented before moving to pilot readiness.

Verification:

- Review checklist against completed onboarding tasks.
- Confirm every unresolved item has a classification, owner, and next action.
