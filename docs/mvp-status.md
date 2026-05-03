# Current MVP Status

Cutoff date: 2026-05-03

This document summarizes:

1. What is already solid enough.
2. What is missing for a first testable MVP.
3. What is missing for a more serious commercial MVP.
4. What each product section does and how it should be used.

## Internal Pilot Readiness

Decision date: 2026-05-03

Current decision:

- the scoped MVP is ready for a disciplined internal testing round with caveats
- it is not ready for unsupervised customer use
- the authenticated browser walkthrough was completed manually
- real WhatsApp provider delivery requires valid Meta credentials and remains caveated until verified
- the next phase should follow the sequenced path in [MVP Path To Customer Use](./mvp-path.md)

Release checklist:

- see [Internal Pilot Checklist](./internal-pilot-checklist.md)

## Current State

The project already has a real operational foundation:

- multitenancy with RLS
- authentication and memberships
- properties, leads, and conversations
- basic internal appointments
- FAQs and channels
- consistent and usable visual shell
- WhatsApp significantly hardened compared with the initial version
- tenant templates with backend, UI, and audit foundation

Practical conclusion:

- the system has passed a manual internal functional testing round
- it is not ready for unsupervised real customers yet
- the highest-value work is now to groom and execute customer-facing MVP readiness work in sequence

## Current MVP Cut

The active MVP target is a scoped commercial flow:

`property -> lead -> conversation -> visit -> follow-up`

This cut is intentionally narrow. New work should be classified before implementation as `MVP`, `bug`, `technical debt`, `post-MVP`, or `exploration`.

### MVP Must Have

1. `[x]` Harden server-side permissions for tenant-scoped writes and role-sensitive actions.
2. `[x]` Close the invitation and membership workflow enough for real internal testing.
3. `[x]` Make the full property -> lead -> conversation -> visit flow usable without broken transitions at code/build level.
4. `[x]` Make appointments operational enough for advisor assignment, status changes, and internal agenda visibility.
5. `[x]` Add minimal commercial reporting for advisor activity, pipeline/stage, response time, and visit outcomes.
6. `[x]` Keep WhatsApp reliable for supervised manual operation, including inbound, outbound, templates, retries, and error visibility.
7. `[x]` Add focused regression coverage for MVP-critical permissions, tenant scoping, WhatsApp payload handling, and business-state transitions.

### Explicitly Post-MVP

- Advanced AI.
- Billing.
- Full omnichannel support.
- Google Calendar integration.
- Rich branding customization.
- Large architecture rewrites.
- Self-service onboarding.

## Remaining Before Internal Testing Session

This is no longer a feature backlog. These are execution checks for the first serious test session:

- confirm local or target environment is running
- login with seed users
- execute the authenticated walkthrough in [Internal Pilot Checklist](./internal-pilot-checklist.md)
- classify any issue found as `pilot blocker`, `non-blocker`, or `post-MVP`
- verify real WhatsApp delivery only if valid Meta credentials are part of the test session

## Historical Gaps Addressed for the First Testable MVP

This is the minimum reasonable scope to start using the system in disciplined internal tests.

### 1. Invitations and User Management

Missing:

- harden server-action permissions and improve multi-tenant management

Usable foundation:

- `Settings` can already add an existing user or invite a new one by email
- if the email does not exist, Supabase sends an invitation and the membership remains `invited`
- a first layer of role-based UI guards already exists in sidebar, screens, and critical routes

Impact:

- today the system can operate with seed users or manually loaded users
- it is enough for small internal tests
- for real team testing, the gaps appear quickly

### 2. Pipeline and Operational Appointments

Missing:

- more consistent and auditable pipeline history
- real advisor availability expectations
- appointment visibility as an operational workflow, not only static tenant rules

Impact:

- visits and rules can already be registered
- the system does not yet handle availability/conflict expectations well enough

### 3. More Mature Leads

Missing:

- stronger search and filters only where they block internal tests
- better commercial-evolution traceability

Impact:

- current leads are enough for simple internal tests
- deduplication/merge becomes important at real volume, but stays post-MVP unless it blocks a pilot

### 4. Minimal Reports

Missing:

- by advisor
- by stage
- response time
- conversion

Impact:

- today the dashboard shows very basic metrics
- it is not enough yet for real commercial management

### 5. Operational WhatsApp Closure

This area is already quite advanced, but the MVP still needs:

- reliable supervised manual operation for inbound, outbound, templates, retries, and errors
- enough operational metrics and visibility for internal testing
- real Meta approval/sync stays post-MVP unless it blocks a pilot

Impact:

- it is already useful for internal testing
- serious operation still needs more controls and visibility

## Missing for a More Serious Commercial MVP

This is not required just to start testing. It is required to sell with less operational risk.

### Tenants and Branding

Missing:

- basic tenant branding
- robust multi-tenant selector
- better per-user defaults

### Channels and Credentials

Missing:

- functional Meta account connection from UI
- safer and more complete credential management per tenant
- more guided channel creation

### Technical Quality

Missing:

- integration / end-to-end tests
- more useful and operable logs
- rate limiting on sensitive endpoints

### Reports and Operations

Missing:

- useful commercial management board
- metrics by advisor and stage
- conversion and response-time visibility

## Recommended Order

Pragmatic order:

1. fine-grained permissions and server actions
2. invitations and user management
3. property -> lead -> conversation -> visit flow
4. real operational appointments
5. basic reports
6. WhatsApp hardening for supervised manual operation

If the priority is to start testing as soon as possible:

1. stabilize users/roles
2. test the full property -> lead -> conversation -> visit flow
3. close the gaps found during that test

## Functional Guide by Section

### Summary

What it does:

- shows the tenant's general state
- acts as the entry dashboard
- concentrates summarized metrics and recent activity

How to use it:

- enter to understand current property, lead, and conversation volume
- review recent activity
- use it as a starting point, not as the detailed operational tool

### Properties

What it does:

- maintains the tenant's structured inventory
- stores key commercial data for each property
- acts as the source of truth for answers and commercial matching

How to use it:

- create new properties
- complete relevant sale/rental data
- edit and inspect property records
- later link leads and conversations to real properties

Current limitations:

- media/storage is not closed yet
- advanced filters are still basic
- media/storage and advanced filters are post-MVP unless they block a concrete test

### Leads

What it does:

- concentrates inquiries or interested contacts captured through channels or manual entry
- allows commercial status, pipeline, and advisor assignment

How to use it:

- create a manual lead if it arrives outside the automatic flow
- review lead detail
- assign advisor
- move through pipeline
- schedule visits from the lead when appropriate

Current limitations:

- no deduplication/merge
- filters are still limited
- deduplication/merge is post-MVP unless it becomes a real pilot blocker

### Conversations

What it does:

- centralizes conversational operations
- shows message timeline
- allows manual replies
- allows human handoff and links to lead/property

How to use it:

- review open conversations
- reply manually
- hand off to a human
- assign advisor
- link to a lead and property
- use approved templates when applicable

Current limitations:

- template usage UX can still improve
- it remains a WhatsApp-first operation

### Appointments

What it does:

- registers internal visits
- applies tenant appointment rules
- shows appointments and basic operational state

How to use it:

- create visits from linked lead or conversation context
- confirm/cancel visits
- review active rules

Current limitations:

- no real advisor availability yet
- no Google Calendar yet

### FAQs

What it does:

- stores structured tenant FAQ answers
- acts as a commercial knowledge base

How to use it:

- create frequent questions
- keep them active/inactive
- reuse them as business answer material

Current limitations:

- categories and search are still basic

### Channels

What it does:

- concentrates channel operational state
- currently focuses on WhatsApp
- shows templates, audit trail, and basic operational metrics

How to use it:

- check whether the channel is connected
- manage tenant templates
- approve/pause/reject templates locally
- review recent metrics and incidents

Current limitations:

- real Meta approval/sync is missing
- guided channel creation from UI is missing

### Settings

What it does:

- concentrates tenant operational settings
- includes members and general rules

How to use it:

- review and manage tenant internal users
- adjust global settings
- review internal appointment rules

Current limitations:

- email invitation acceptance needs tighter closure
- roles/guards can be hardened further

### Platform / Tenants

What it does:

- global administration section for platform admins
- allows tenant creation and editing

How to use it:

- create new tenants
- edit general metadata
- operate as platform administration, not as a commercial tenant user

## What Can Be Tested Today

Recommended internal test flows:

### Flow 1

- create property
- create lead
- link conversation to lead
- reply manually
- move status/pipeline
- schedule visit

### Flow 2

- create FAQ
- create WhatsApp template
- approve it locally
- use it from manual conversation

### Flow 3

- manage tenant members
- verify visibility by role
- review dashboard and main lists

## Exit Criteria for First Testing Round

The system is ready for a serious first internal testing round when:

- the property -> lead -> conversation -> visit flow works without major friction
- user management does not depend on awkward manual loading
- no runtime errors appear in main pages
- WhatsApp supports at least manual operation and basic templates without breaking

## Final Recommendation

The product is no longer in the foundation stage. It is now in the stage of:

- testing real flow
- detecting operational blockers
- closing business UX gaps

The correct priority now is:

1. users and permissions
2. pipeline and appointments
3. basic reports
4. operational WhatsApp closure
