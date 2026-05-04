# Current Pending Work

This file tracks what remains after completing the scoped MVP backlog.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

## Current Release State

Status: internal manual testing, UI/UX polish, operational readiness documentation, and security permissions review completed with pilot caveats before a supervised customer MVP.

Reference:

- [Internal Pilot Checklist](./internal-pilot-checklist.md)
- [MVP Path To Customer Use](./mvp-path.md)
- [UI/UX MVP Polish Backlog](./ui-ux-backlog.md)
- [Operational MVP Readiness Backlog](./operational-readiness-backlog.md)
- [Security And Permissions Review Backlog](./security-permissions-review-backlog.md)

The implementation backlog for the first MVP cut is complete. The UI/UX MVP polish backlog is complete. The operational readiness block is documented in [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md).
The current proposed next phase is real tenant onboarding for a supervised pilot, after confirming the documented security caveats.

## Required Before Customer-Facing MVP

1. Complete real tenant onboarding grooming and execution.
2. Complete pilot readiness grooming after real tenant onboarding.
3. Confirm whether real WhatsApp provider delivery is part of the first customer pilot.
4. If real WhatsApp delivery is in scope, verify valid Meta credentials, template behavior, and `WHATSAPP_APP_SECRET`.

## Known Caveats

- Security and permissions review is complete, but pilot caveats remain documented in `security-permissions-review-backlog.md`.
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
