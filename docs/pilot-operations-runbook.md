# Supervised Pilot Operations Runbook

Date: 2026-05-04

Status: ready for operational review.

This runbook prepares the current MVP for a supervised customer pilot. It assumes the product scope remains:

`property -> lead -> conversation -> visit -> follow-up`

The goal is operational repeatability, not new product scope.

## 1. Pilot Tenant Setup

### Setup Owner

Assign one person as pilot setup owner before configuration starts. That person owns the checklist, confirms each step, and records open caveats.

Recommended owner: Project Manager or Project Leader / Technical Lead.

### Required Decisions Before Setup

- Pilot tenant name.
- Tenant slug.
- Primary currency.
- Timezone.
- Initial users and roles.
- Whether real WhatsApp provider delivery is in scope.
- Whether the pilot uses local, staging, or production-like infrastructure.
- Whether customer data is real, anonymized, or sample data.

### Tenant Configuration Steps

1. Create or select the tenant.
2. Confirm tenant name, slug, currency, locale, and timezone.
3. Confirm appointment rules:
   - working days
   - business hours
   - default visit duration
   - buffer between visits
   - minimum advance notice
4. Confirm pipeline stages:
   - default intake stage
   - qualified/active stages
   - visit/follow-up stages if used by the pilot
   - closed/lost stage if used by the pilot
5. Confirm tenant users:
   - at least one tenant owner or admin
   - at least one advisor or operator for daily use
   - optional viewer for read-only validation
6. Load initial properties.
7. Load initial leads if the pilot starts with existing contacts.
8. Load initial FAQs.
9. Configure channels and WhatsApp templates if provider behavior is part of the pilot.
10. Run the setup verification checklist.

### Setup Verification Checklist

- Tenant appears in the active tenant selector or active tenant context.
- Owner/admin can access settings and channels.
- Advisor/operator can access operational screens.
- Viewer cannot perform restricted writes.
- Properties list shows the expected initial catalog.
- Leads list shows expected initial contacts, if any.
- FAQs list shows active answers.
- Appointment rules appear correctly in lead/conversation visit forms.
- Conversations can link to a lead and property.
- A visit can be scheduled and appears in agenda, lead detail, and property detail.
- Channel and template screens show expected caveats or configured provider data.

## 2. Customer Data Preparation

### Required Data

Collect this before setup starts:

- Tenant:
  - company display name
  - slug preference
  - primary currency
  - timezone
- Users:
  - full name
  - email
  - role
  - active/invited expectation
- Properties:
  - title
  - operation type
  - property type
  - status
  - price and currency
  - city and neighborhood
  - short location text
- FAQs:
  - question
  - answer
  - category
  - active/inactive status
- Appointment rules:
  - working days
  - business hours
  - visit duration
  - buffer
  - advance notice

### Optional Data

- Property external reference.
- Property expenses.
- Property full address.
- Property bedrooms, bathrooms, garages, built area, and lot area.
- Property description.
- Property attributes: pets, furnished, pool, garden, balcony.
- Initial leads and notes.
- Lead budget, preferred city/neighborhood, bedroom needs, and financing/pets flags.
- WhatsApp display phone and provider credentials.
- WhatsApp templates and status expectations.

### Data Quality Checks

Before loading data:

- Property titles are unique enough for operators to recognize.
- Currency values are consistent with tenant currency expectations.
- Phone numbers include country/area information where needed.
- FAQs are written as customer-facing answers, not internal notes.
- Appointment rules match the actual working schedule.
- Users have correct roles and no one is missing admin ownership.
- If WhatsApp is in scope, credentials and webhook assumptions are confirmed.

## 3. Known Limitations And Pilot Caveats

### Supported In The Supervised Pilot

- Tenant-scoped operation.
- Role-based access for owner/admin/advisor/operator/viewer.
- Property creation, editing, listing, and detail review.
- Lead creation, editing, routing, status, pipeline stage, and detail review.
- Conversation review, manual replies, linking to lead/property, routing, and retries.
- Internal appointment scheduling, assignment, status changes, and agenda visibility.
- FAQs as structured response base.
- Channel and WhatsApp template administration for supervised operation.
- Basic dashboard metrics and operational visibility.

### Pilot Caveats

| Area                        | Classification   | Caveat                                                                                  |
| --------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| WhatsApp provider delivery  | pilot caveat     | Real outbound delivery requires valid Meta credentials and must be verified separately. |
| Meta template approval/sync | post-MVP         | Template approval is represented internally; real Meta approval/sync is not automated.  |
| Rate limiting               | operational risk | No persistent distributed rate limiter exists for public endpoints.                     |
| Browser E2E tests           | operational risk | Browser-level automated E2E coverage is not in place.                                   |
| Onboarding                  | pilot caveat     | Tenant/customer setup is manual and runbook-driven.                                     |
| Billing                     | post-MVP         | Billing and subscription operations are out of scope.                                   |
| Media                       | post-MVP         | Rich property media with Supabase Storage is out of scope.                              |
| Advanced AI                 | post-MVP         | AI must not decide business truth and advanced AI workflows are out of scope.           |
| External integrations       | post-MVP         | Google Calendar, external CRM imports, and omnichannel expansion are out of scope.      |

### Recommended Expectation Wording

Use this internally when describing the pilot:

> This is a supervised operational pilot for the core commercial workflow. It validates property, lead, conversation, visit, and follow-up operations with known limitations. It is not yet a self-service or unsupervised production launch.

## 4. Support And Issue Classification

### Issue Classes

- `pilot blocker`: prevents the pilot from continuing or compromises tenant/security integrity.
- `pilot degraded`: pilot can continue with a documented workaround.
- `non-blocker`: visible issue that does not materially affect pilot flow.
- `post-MVP`: valid request outside pilot scope.
- `invalid/test-data`: caused by missing setup data, wrong role, or invalid test assumptions.

### Issue Intake Template

Use this format for every pilot issue:

```md
## Summary

## Issue class

pilot blocker | pilot degraded | non-blocker | post-MVP | invalid/test-data

## Environment

local | staging | production-like

## Tenant

## User and role

## Route or screen

## Steps to reproduce

## Expected result

## Actual result

## Data involved

property / lead / conversation / appointment / FAQ / channel / user

## Error details

UI message, logs, server response, channel event, or audit entry

## Workaround

## Owner

## Decision

continue | pause | fix before next session | post-MVP
```

### First Checks By Area

- Auth:
  - user can log in
  - user profile exists
  - active tenant is correct
  - membership status is active
- Permissions:
  - user role matches the action being attempted
  - UI and server guard expectations match
- Data setup:
  - required tenant data exists
  - property/lead/conversation IDs belong to the active tenant
- Appointments:
  - lead exists
  - appointment rules allow selected date/time
  - advisor is available enough for pilot expectations
- Channels:
  - provider credentials are configured if real delivery is expected
  - template status matches pilot assumptions
  - failed messages and channel events are reviewed before retrying
- Server errors:
  - capture error message
  - capture route/action
  - capture user role and tenant

### Pause Criteria

Pause the pilot if:

- cross-tenant data is visible or mutable
- an unauthorized role can perform restricted writes
- login/active tenant resolution is unreliable
- core flow cannot proceed from lead/conversation to visit
- real WhatsApp delivery is promised but not functioning
- data corruption is suspected

## 5. Environment And Deployment Readiness

### Required Local Checks

Run before any dry run:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run`
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .`
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json`
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack`

### Required Environment Variables

Minimum:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Required only if real provider behavior is in scope:

- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_CLOUD_API_VERSION`
- `WHATSAPP_CREDENTIALS_JSON`
- `RESEND_API_KEY`
- `AI_PROVIDER`
- `AI_API_KEY`

### Supabase Readiness

Confirm:

- migrations have been applied
- RLS is enabled on critical tables
- expected seed or pilot data exists
- auth users and tenant memberships exist
- tenant users include at least one active owner/admin
- storage/media assumptions are documented as out of scope unless explicitly configured

### Target Deployment Readiness

Before inviting pilot users:

- target app URL is known
- target Supabase project is known
- environment variables are present
- build completes
- login works
- active tenant resolves
- target data is tenant-scoped
- provider caveats are documented

If any target-environment check cannot be performed, mark it as pending with an owner before proceeding.

## 6. Observability And Error Review

### Where To Check First

- UI feedback:
  - form-level success/error messages
  - empty states
  - failed outbound message cards
- Dashboard:
  - high-level reporting after state changes
- Conversations:
  - message status
  - failed message retry
  - linked lead/property
  - routing and handoff state
- Channels:
  - channel health metrics
  - recent failures
  - template status history
- Database:
  - `audit_logs`
  - `channel_events`
  - `conversation_messages`
  - `appointments`
  - `tenant_users`
- Supabase:
  - auth logs
  - database logs
  - API logs
- Hosting provider:
  - application runtime logs
  - build/deploy logs

### Daily Pilot Review

At the end of each pilot day:

1. Review new issues and classifications.
2. Review failed outbound messages.
3. Review channel events and recent failures.
4. Review appointment changes and visit outcomes.
5. Review tenant user or role changes.
6. Confirm no cross-tenant or permission issue was reported.
7. Decide which issues must be fixed before the next session.

### Before Retrying Or Changing Data

Capture:

- tenant
- user and role
- affected record IDs
- current status
- error message or event
- action attempted
- timestamp

Then decide whether retrying is safe.

## 7. Pilot Dry Run

Run this after the setup, data, caveats, support, environment, and observability sections are reviewed.

### Roles To Use

- tenant owner/admin
- advisor or operator
- viewer
- platform admin only if platform tenant screens are part of the dry run

### Dry Run Checklist

1. Login as owner/admin.
2. Confirm active tenant.
3. Review settings, appointment rules, users, and pipeline stages.
4. Review properties list and one property detail.
5. Create or edit one property if appropriate.
6. Review leads list and one lead detail.
7. Create or edit one lead if appropriate.
8. Review FAQs.
9. Review channels and template caveats.
10. Review conversations list and one conversation detail.
11. Link conversation to lead and property.
12. Send or simulate manual reply according to provider caveats.
13. Schedule a visit from lead or conversation.
14. Confirm the visit appears in agenda, lead detail, and property detail.
15. Update visit status.
16. Review dashboard metrics after state changes.
17. Repeat permission-sensitive checks with advisor/operator.
18. Confirm viewer cannot perform restricted writes.
19. Create one simulated support issue and classify it.
20. Run the daily pilot review.

### Go/No-Go Criteria

Go if:

- tenant setup is complete
- required customer data is loaded or intentionally omitted
- core flow works end to end
- role-sensitive checks pass
- known caveats are documented
- support owner and pause criteria are clear

No-go if:

- tenant isolation is questionable
- login/active tenant resolution fails
- core flow cannot create or review visits
- provider delivery is promised but unverified
- pilot blockers remain unclassified or unowned

### After The Dry Run

Update:

- issue list
- known limitations
- setup checklist
- support runbook
- go/no-go decision
- next phase backlog
