# Current Pending Work

This file tracks what remains after completing the scoped MVP backlog.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

## Current Release State

Status: internal manual testing, UI/UX polish, operational readiness documentation, security permissions review, and real tenant onboarding documentation completed with pilot caveats before a supervised customer MVP.

Reference:

- [Internal Pilot Checklist](./internal-pilot-checklist.md)
- [MVP Path To Customer Use](./mvp-path.md)
- [UI/UX MVP Polish Backlog](./ui-ux-backlog.md)
- [Operational MVP Readiness Backlog](./operational-readiness-backlog.md)
- [Security And Permissions Review Backlog](./security-permissions-review-backlog.md)
- [Real Tenant Onboarding Backlog](./real-tenant-onboarding-backlog.md)
- [First Tenant Onboarding Runbook](./first-tenant-onboarding-runbook.md)

The implementation backlog for the first MVP cut is complete. The UI/UX MVP polish backlog is complete. The operational readiness block is documented in [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md).
The real tenant onboarding block is documented in [First Tenant Onboarding Runbook](./first-tenant-onboarding-runbook.md).
The current proposed next phase is `Pilot Readiness` grooming for a supervised customer pilot.

## Required Before Customer-Facing MVP

1. Complete `Pilot Readiness` grooming.
2. Confirm whether real WhatsApp provider delivery is part of the first customer pilot.
3. If real WhatsApp delivery is in scope, verify valid Meta credentials, template behavior, and `WHATSAPP_APP_SECRET`.
4. Execute final go/no-go checklist for the supervised pilot.

## Known Caveats

- Security and permissions review is complete, but pilot caveats remain documented in `security-permissions-review-backlog.md`.
- Real tenant onboarding is documented, but actual first-customer data and setup still need to be executed for the selected pilot tenant.
- Real Meta outbound delivery requires valid provider credentials.
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
