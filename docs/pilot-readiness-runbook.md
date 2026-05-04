# Pilot Readiness Runbook

Date: 2026-05-04

Status: ready for local supervised pilot execution with caveats.

This runbook closes the local pilot readiness preparation for the scoped MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

The selected WhatsApp mode for this readiness pass is:

`simulated/manual`

Real Meta WhatsApp provider delivery is not part of this local readiness pass. Conversation workflow can be validated with existing or manually prepared conversation data. A separate provider smoke test is required before promising real WhatsApp operation to a customer.

## 1. Readiness Record

Use this record for the final local readiness pass.

```md
## Pilot Readiness Record

Environment: local
Tenant:
Data mode: customer-like | real | anonymized | sample
WhatsApp mode: simulated/manual
Readiness owner:
Technical reviewer:
Product decision owner:
Support owner:
Date:
Decision: go with caveats
Open blockers:
Accepted caveats:
Next action:
```

## 2. Final QA Scope

### Environment

Default local environment:

- App: `http://127.0.0.1:3003`
- Supabase local API: configured by `supabase/config.toml`
- Supabase local DB: configured by `supabase/config.toml`
- WhatsApp provider: not connected for this pass

### Automated Checks

Run before the final manual walkthrough:

```bash
pnpm lint
pnpm test
pnpm build
```

If a full build is too slow during iteration, at minimum run:

```bash
pnpm test
```

Any failure must be classified as:

- `pilot blocker`
- `pilot degraded`
- `non-blocker`
- `post-MVP`
- `invalid/test-data`

### Manual Checks

Required manual checks:

- login works for the selected pilot role set
- active tenant is correct
- owner/admin can access settings
- advisor/operator can operate core screens
- viewer cannot perform restricted writes, if viewer is part of the pilot
- property catalog is visible and usable
- lead workflow is usable
- conversation workflow is usable with simulated/manual data
- visit can be scheduled
- visit appears in agenda, lead detail, and property detail
- caveats are accepted before the pilot starts

## 3. Customer-Like Walkthrough

Execute this flow with the selected tenant.

1. Log in as owner/admin.
2. Confirm active tenant.
3. Confirm tenant settings are correct.
4. Review users and roles.
5. Review property catalog.
6. Create or select a lead.
7. Open or prepare a conversation record.
8. Link conversation to lead and property where applicable.
9. Validate manual/simulated conversation handling.
10. Schedule a visit.
11. Confirm visit appears in agenda.
12. Confirm visit appears in lead detail.
13. Confirm visit appears in property detail.
14. Review dashboard/reporting basics.
15. Record issues using the issue intake format.

Do not require real WhatsApp inbound/outbound delivery for this pass.

## 4. WhatsApp Mode Decision

Decision: `simulated/manual`.

Included:

- conversation list/detail UX
- linking conversation to lead and property
- manual operational handling around conversations
- templates as internal operational data, if configured
- failed/retry UI review only when existing test data supports it

Not included:

- real inbound messages from Meta
- real outbound delivery through Meta
- real webhook signature verification
- real template approval/sync with Meta
- real `sent`, `delivered`, or `read` provider lifecycle

Required caveat wording:

> Real WhatsApp provider delivery is not part of this readiness pass. Conversation workflow is validated with existing or manually prepared data. A separate Meta provider smoke test is required before promising real WhatsApp operation.

Before switching to real provider mode, confirm:

- valid Meta credentials
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- phone number ID
- webhook reachable from Meta
- inbound smoke test
- outbound/template smoke test where applicable

## 5. Caveats And Known Issues

Accepted for local supervised readiness:

| Area                          | Classification  | Decision                                                   |
| ----------------------------- | --------------- | ---------------------------------------------------------- |
| WhatsApp real provider        | accepted caveat | Simulated/manual mode for local readiness.                 |
| Meta template approval/sync   | post-MVP        | Not required for local readiness.                          |
| Public endpoint rate limiting | accepted caveat | Known hardening gap; does not block local supervised pass. |
| Browser E2E coverage          | accepted caveat | Manual walkthrough required.                               |
| Self-service onboarding       | post-MVP        | Manual onboarding remains expected.                        |
| Billing                       | post-MVP        | Out of scope.                                              |
| Google Calendar               | post-MVP        | Out of scope.                                              |
| Advanced AI                   | post-MVP        | Out of scope.                                              |

Block the pilot if:

- cross-tenant data is visible or mutable
- unauthorized roles can perform restricted writes
- selected users cannot log in
- active tenant resolution is unreliable
- properties, leads, conversations, or visits cannot support the core walkthrough
- real WhatsApp is promised without provider setup and smoke testing

## 6. Support Ownership

Before starting the supervised pilot, assign:

| Responsibility               | Owner |
| ---------------------------- | ----- |
| Readiness owner              |       |
| Product decision owner       |       |
| Technical escalation owner   |       |
| Support/issue intake owner   |       |
| Customer communication owner |       |

Triage rhythm for local/supervised pilot:

- Record issues immediately.
- Classify before fixing.
- Pause only for `pilot blocker`.
- Continue with documented workaround for `pilot degraded`.
- Move valid but non-blocking requests to post-pilot review.

## 7. Issue Intake Format

```md
## Summary

## Issue class

pilot blocker | pilot degraded | non-blocker | post-MVP | invalid/test-data

## Environment

local

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

## 8. Pause And Rollback Criteria

Pause the pilot if any of these occur:

- tenant isolation fails
- unauthorized write succeeds
- login or active tenant cannot be trusted
- core flow cannot complete from lead/conversation to visit
- user role setup blocks the pilot team
- data corruption is suspected
- customer expectations include WhatsApp real delivery but provider setup is missing

Available mitigation paths:

| Risk                          | Mitigation                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------- |
| Wrong tenant data             | Pause, correct setup data, rerun tenant verification.                             |
| Wrong role                    | Pause affected user, correct membership, rerun role checks.                       |
| Core flow blocker             | Pause pilot, classify bug, fix before next session.                               |
| WhatsApp expectation mismatch | Switch script to simulated/manual or pause until provider smoke test is complete. |
| Data quality issue            | Correct seed/customer-like data and rerun affected flow.                          |

Pause decision owner: Product decision owner with technical reviewer input.

## 9. Feedback Capture Plan

Capture every pilot observation as one of:

- `bug`
- `UX friction`
- `operational gap`
- `feature request`
- `post-MVP idea`
- `invalid/test-data`

Feedback template:

```md
## Observation

## Classification

bug | UX friction | operational gap | feature request | post-MVP idea | invalid/test-data

## User role

## Flow

property | lead | conversation | visit | follow-up | settings | channel

## Impact

blocks pilot | slows pilot | confusing | nice to have | out of scope

## Evidence

## Suggested next step

fix now | backlog | post-MVP | discard
```

Post-pilot review:

- Review blockers immediately.
- Review degraded/non-blocking issues after the session.
- Groom feature requests only after pilot observations are grouped.
- Do not add new scope directly from pilot feedback without classification.

## 10. Final Go/No-Go Checklist

For this local readiness pass, the expected decision is:

`go with caveats`

Use `go` only when real tenant data, selected environment, and all promised integrations are verified.

Checklist:

- Automated checks completed or failures classified.
- Manual walkthrough completed.
- Active tenant verified.
- Roles verified.
- Property catalog usable.
- Lead workflow usable.
- Conversation workflow usable in simulated/manual mode.
- Visit scheduling usable.
- Agenda, lead detail, and property detail show scheduled visit.
- WhatsApp real provider explicitly excluded from this pass.
- Accepted caveats documented.
- Support owners assigned.
- Pause criteria accepted.
- Feedback capture process accepted.
- No unresolved `pilot blocker` remains.

Decision options:

| Decision        | Meaning                                                         |
| --------------- | --------------------------------------------------------------- |
| go              | Ready for supervised pilot with promised integrations verified. |
| go with caveats | Ready for supervised pilot under documented limitations.        |
| no-go           | Pilot is blocked until listed blockers are resolved.            |

Current recommendation:

`go with caveats` for local supervised readiness, provided the manual walkthrough and automated checks pass and the pilot does not promise real WhatsApp delivery.
