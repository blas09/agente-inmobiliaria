# First Tenant Onboarding Runbook

Date: 2026-05-04

Status: ready for operational review.

This runbook covers the minimum repeatable process to onboard the first real customer tenant for a supervised MVP pilot.

The target product flow remains:

`property -> lead -> conversation -> visit -> follow-up`

This is a manual, supervised onboarding process. It is not self-service onboarding and does not include billing, public signup, automated imports, or production launch automation.

## 1. Onboarding Record

Create one onboarding record per pilot tenant before setup starts.

```md
## Tenant Onboarding Record

Customer:
Setup owner:
Technical reviewer:
Environment: local | staging | production-like
Setup date:
Tenant name:
Tenant slug:
Primary currency:
Timezone:
Locale:
Data mode: real | anonymized | sample
WhatsApp mode: real provider | simulated/manual | out of scope
Security caveats confirmed: yes | no
Open blockers:
Accepted caveats:
Exit decision: ready for pilot readiness | blocked | needs follow-up
```

Required setup owner: Project Manager or Project Leader / Technical Lead.

Required technical reviewer: Project Leader / Technical Lead or Backend / Security.

## 2. Customer Data Intake Template

The setup owner must collect the required data before creating the tenant. Missing required data blocks onboarding.

### Required Tenant Data

| Field                | Required | Notes                                                                  |
| -------------------- | -------- | ---------------------------------------------------------------------- |
| Company display name | yes      | Visible tenant/customer name.                                          |
| Preferred slug       | yes      | Lowercase, stable identifier.                                          |
| Primary currency     | yes      | Expected first pilot value: `PYG` unless explicitly decided otherwise. |
| Timezone             | yes      | Expected first pilot value for Paraguay: `America/Asuncion`.           |
| Locale               | yes      | Expected first pilot value: `es-PY`.                                   |
| Data mode            | yes      | `real`, `anonymized`, or `sample`.                                     |

### Required Users

At minimum:

- one `tenant_owner` or `tenant_admin`
- one daily operational user: `advisor` or `operator`

User template:

| Full name | Email | Role                                                                    | Initial status    | Notes |
| --------- | ----- | ----------------------------------------------------------------------- | ----------------- | ----- |
|           |       | `tenant_owner` \| `tenant_admin` \| `advisor` \| `operator` \| `viewer` | active \| invited |       |

Rules:

- Do not leave the tenant without an active owner/admin.
- Use `viewer` only when read-only validation is useful.
- Do not use `platform_admin` for daily customer operation.

### Required Appointment Rules

| Field                  | Required | Example       |
| ---------------------- | -------- | ------------- |
| Working days           | yes      | Monday-Friday |
| Business hours start   | yes      | 08:00         |
| Business hours end     | yes      | 18:00         |
| Default visit duration | yes      | 60 minutes    |
| Buffer between visits  | yes      | 15 minutes    |
| Minimum advance notice | yes      | 24 hours      |

### Required Property Data

Minimum recommended catalog: 3 to 10 properties. The pilot can start with fewer only if the customer explicitly validates that the catalog is enough for a first walkthrough.

| Field                      | Required | Notes                                                        |
| -------------------------- | -------- | ------------------------------------------------------------ |
| Title                      | yes      | Clear enough for advisors/operators.                         |
| Operation type             | yes      | sale \| rent.                                                |
| Property type              | yes      | apartment \| house \| land \| office \| commercial \| other. |
| Status                     | yes      | Should reflect real commercial availability.                 |
| Price                      | yes      | Use null only when customer intentionally hides price.       |
| Currency                   | yes      | Usually tenant primary currency.                             |
| City                       | yes      |                                                              |
| Neighborhood               | yes      |                                                              |
| Location text              | yes      | Short recognizable location summary.                         |
| External reference         | optional | Useful if customer has internal codes.                       |
| Description                | optional | Customer-facing description.                                 |
| Bedrooms/bathrooms/garages | optional | Useful for residential properties.                           |
| Area/lot area              | optional | Useful for comparison.                                       |
| Address                    | optional | Do not collect if the customer wants to keep it private.     |
| Attributes                 | optional | pets, furnished, pool, garden, balcony.                      |

### Required FAQ Data

Minimum recommended FAQ categories:

- property visits
- prices and availability
- location and requirements
- financing or payment expectations
- contact and follow-up

FAQ template:

| Question | Answer | Category | Status             |
| -------- | ------ | -------- | ------------------ |
|          |        |          | active \| inactive |

Rules:

- Write answers in Spanish.
- Keep answers customer-facing.
- Do not include internal notes, private prices, credentials, or unsupported promises.

### Optional Initial Leads

Initial leads are optional. If loaded, collect:

| Field                     | Required | Notes                                           |
| ------------------------- | -------- | ----------------------------------------------- |
| Full name                 | yes      |                                                 |
| Phone or email            | yes      | At least one contact field.                     |
| Source                    | yes      | Example: WhatsApp, referral, Facebook, website. |
| Interest type             | optional | sale \| rent.                                   |
| Budget min/max            | optional |                                                 |
| Desired city/neighborhood | optional |                                                 |
| Assigned user             | optional | Must belong to the tenant.                      |
| Notes                     | optional | Operational notes only.                         |

### WhatsApp Decision

Choose one mode before onboarding starts:

| Mode             | Meaning                                                                          | Required before pilot                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| real provider    | Real Meta WhatsApp inbound/outbound is part of the pilot.                        | Valid Meta credentials, phone number ID, verify token, `WHATSAPP_APP_SECRET`, templates, webhook reachability, and smoke test. |
| simulated/manual | UI and operational flows are tested, but real provider delivery is not promised. | Customer expectation documented.                                                                                               |
| out of scope     | WhatsApp is not part of the first pilot session.                                 | Customer expectation documented.                                                                                               |

## 3. Data Quality Gate

Do not start setup until these checks pass:

- Tenant name, slug, currency, timezone, and locale are complete.
- At least one owner/admin is defined.
- At least one advisor/operator is defined.
- Property titles are recognizable and not duplicates.
- Property status matches the customer's actual availability expectation.
- Appointment rules match the customer's real working schedule.
- FAQs are written in Spanish and are safe to show to customers.
- Phone numbers include enough country/area context when used.
- WhatsApp mode is explicitly decided.
- If real WhatsApp is in scope, `WHATSAPP_APP_SECRET` is planned and provider credentials are available.

## 4. Tenant Setup Checklist

Use the existing platform/admin and settings UI wherever possible.

1. Confirm environment.
2. Confirm setup owner and technical reviewer.
3. Confirm security caveats from [Security And Permissions Review Backlog](./security-permissions-review-backlog.md).
4. Create or select the tenant.
5. Configure tenant name, slug, status, currency, timezone, and locale.
6. Configure supported tenant settings and branding fields only if available in the current UI.
7. Create or invite initial users.
8. Assign roles.
9. Confirm at least one active owner/admin.
10. Configure appointment rules.
11. Configure pipeline stages.
12. Load initial property catalog.
13. Load initial leads only if part of the pilot.
14. Load FAQs.
15. Configure channel and templates only according to the WhatsApp decision.
16. Run first login and active tenant verification.
17. Run core commercial flow verification.
18. Complete onboarding exit checklist.

## 5. Users And Roles Verification

### Owner/Admin

- Can log in or has accepted invitation.
- Lands in the correct active tenant.
- Can access settings.
- Can access channels.
- Can manage users.
- Can create/update/delete properties and leads where expected.

### Advisor/Operator

- Can log in or has accepted invitation.
- Lands in the correct active tenant.
- Can access operational screens.
- Can create/update properties and leads.
- Can operate conversations.
- Can create/update visits.
- Cannot access admin-only tenant settings unless role allows it.

### Viewer

Use only if included in pilot setup.

- Can log in.
- Lands in the correct active tenant.
- Can view expected operational data.
- Cannot create/update/delete properties.
- Cannot create/update/delete leads.
- Cannot manage tenant settings or channels.

## 6. Property Catalog Verification

After loading properties:

- Property list shows the expected catalog.
- Property detail shows title, operation type, property type, status, price/currency, city/neighborhood, and location text.
- At least one property is usable for a lead/conversation/visit walkthrough.
- Property selection works in appointment flows.
- Customer confirms the catalog is acceptable for the first pilot session.

## 7. Appointment Rules And Pipeline Verification

After configuring appointment rules and pipeline stages:

- Settings show the expected working days and business hours.
- Visit duration, buffer, and advance notice match customer expectations.
- Pipeline stages are understandable to the customer team.
- Default stage is correct.
- A valid visit can be scheduled.
- A known invalid visit date/time is rejected with clear Spanish feedback.
- Scheduled visit appears in agenda, lead detail, and property detail.

## 8. FAQ Verification

After loading FAQs:

- FAQ list shows expected categories.
- Active FAQs are customer-facing and written in Spanish.
- Inactive FAQs are intentionally inactive.
- Operators can find useful answers during conversation review.

## 9. WhatsApp Setup Verification

### If Real Provider Is In Scope

Confirm before pilot readiness:

- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` is configured.
- `WHATSAPP_APP_SECRET` is configured.
- Provider credentials are available in the selected environment.
- Phone number ID matches the configured channel.
- Webhook endpoint is reachable by Meta.
- At least one inbound smoke test is processed.
- At least one controlled outbound or template test is attempted and classified.
- Failed messages and channel events are reviewed.

### If Simulated/Manual Or Out Of Scope

Confirm:

- Customer expectations are documented.
- The pilot script does not promise real WhatsApp delivery.
- Any WhatsApp screen caveats are explained before the pilot.

## 10. Core Flow Verification

Use customer-like data.

1. Log in as owner/admin.
2. Confirm active tenant.
3. Review tenant settings.
4. Review property catalog.
5. Create or select a lead.
6. Link or review a conversation.
7. Link lead/property where applicable.
8. Schedule a visit.
9. Confirm visit appears in agenda.
10. Confirm visit appears in lead detail.
11. Confirm visit appears in property detail.
12. Record any issue using the pilot issue classification.

## 11. Onboarding Exit Checklist

Onboarding can move to `Pilot Readiness` only if:

- Required tenant data is complete.
- Users and roles are configured.
- At least one owner/admin is active.
- Daily operator role is available.
- Initial property catalog is loaded and accepted.
- Appointment rules and pipeline are configured.
- FAQ base is loaded or intentionally deferred.
- WhatsApp mode is decided.
- If real WhatsApp is in scope, required secrets and provider assumptions are confirmed.
- First login and active tenant verification are complete.
- Core flow verification is complete.
- No `pilot blocker` remains open.
- Accepted caveats are listed in the onboarding record.

Exit decision:

| Decision                  | Meaning                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ |
| ready for pilot readiness | Onboarding is complete enough to start final pilot readiness checks.           |
| blocked                   | A pilot blocker must be resolved before continuing.                            |
| needs follow-up           | Non-blocking issues exist but can be tracked before or during pilot readiness. |

## 12. Issue Classification

Use the issue classes from [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md):

- `pilot blocker`
- `pilot degraded`
- `non-blocker`
- `post-MVP`
- `invalid/test-data`

Pause onboarding if:

- cross-tenant data appears visible or mutable
- an unauthorized role can perform restricted writes
- login or active tenant resolution is unreliable
- property, lead, conversation, or visit setup cannot support the core flow
- real WhatsApp delivery is promised but required credentials or secrets are missing
