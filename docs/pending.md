# Current Pending Work

This file tracks what remains after completing the scoped MVP backlog.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

## Current Release State

Status: internal manual testing, UI/UX polish, operational readiness documentation, security permissions review, real tenant onboarding documentation, and pilot readiness documentation completed with caveats.

Reference:

- [Internal Pilot Checklist](./internal-pilot-checklist.md)
- [MVP Path To Customer Use](./mvp-path.md)
- [UI/UX MVP Polish Backlog](./ui-ux-backlog.md)
- [Operational MVP Readiness Backlog](./operational-readiness-backlog.md)
- [Security And Permissions Review Backlog](./security-permissions-review-backlog.md)
- [Real Tenant Onboarding Backlog](./real-tenant-onboarding-backlog.md)
- [First Tenant Onboarding Runbook](./first-tenant-onboarding-runbook.md)
- [Pilot Readiness Backlog](./pilot-readiness-backlog.md)
- [Pilot Readiness Runbook](./pilot-readiness-runbook.md)

The implementation backlog for the first MVP cut is complete. The UI/UX MVP polish backlog is complete. The operational readiness block is documented in [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md).
The real tenant onboarding block is documented in [First Tenant Onboarding Runbook](./first-tenant-onboarding-runbook.md).
The pilot readiness block is documented in [Pilot Readiness Runbook](./pilot-readiness-runbook.md).
The current recommendation is `go with caveats` for local supervised readiness, as long as real WhatsApp provider delivery is not promised and the final checks pass.

## Required Before Customer-Facing MVP

1. Run the automated checks defined in `pilot-readiness-runbook.md`.
2. Execute the manual customer-like walkthrough against the selected tenant.
3. Assign support, technical escalation, product decision, and customer communication owners.
4. Keep WhatsApp in `simulated/manual` mode unless a separate Meta provider smoke test is completed.
5. Record the final local readiness decision after checks: `go`, `go with caveats`, or `no-go`.

## Known Caveats

- Security and permissions review is complete, but pilot caveats remain documented in `security-permissions-review-backlog.md`.
- Real tenant onboarding is documented, but actual first-customer data and setup still need to be executed for the selected pilot tenant.
- Pilot readiness assumes WhatsApp `simulated/manual` mode.
- Real Meta inbound/outbound delivery requires valid provider credentials, webhook reachability, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, and a separate smoke test.
- Real Meta template approval/sync is post-MVP unless it blocks the pilot.
- No persistent distributed rate limiter is implemented for public endpoints.
- Browser-level E2E tests are not in place.

## Post-MVP

- Branding customization by tenant.
- Rich property media with Supabase Storage.
- Lead deduplication/merge beyond basic internal hygiene.
- Advanced filters and pagination.
- Real Meta approval/sync workflow for templates.
- Guided channel onboarding from UI.
- Advanced reports and management dashboards.
- Self-service tenant onboarding.
- Google Calendar integration.
- Billing.
- Advanced AI.
- Full omnichannel support.

## Do Not Touch Yet

- Broad architecture rewrites.
- Production launch automation.
- Full security/compliance audit.
