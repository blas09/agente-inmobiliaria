# Current Pending Work

This file tracks what remains after completing the scoped MVP backlog.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

## Current Release State

Status: internal manual testing, UI/UX polish, and operational readiness documentation completed; security review grooming proposed before a supervised customer MVP.

Reference:

- [Internal Pilot Checklist](./internal-pilot-checklist.md)
- [MVP Path To Customer Use](./mvp-path.md)
- [UI/UX MVP Polish Backlog](./ui-ux-backlog.md)
- [Operational MVP Readiness Backlog](./operational-readiness-backlog.md)
- [Security And Permissions Review Backlog](./security-permissions-review-backlog.md)

The implementation backlog for the first MVP cut is complete. The UI/UX MVP polish backlog is complete. The operational readiness block is documented in [Supervised Pilot Operations Runbook](./pilot-operations-runbook.md).
The current proposed next phase is to review and execute the security and permissions backlog before moving to real tenant onboarding.

## Required Before Customer-Facing MVP

1. Review and approve `security-permissions-review-backlog.md`.
2. Execute approved security review tasks.
3. Complete real tenant onboarding and pilot readiness groomings after security review.
4. Confirm whether real WhatsApp provider delivery is part of the first customer pilot.
5. If real WhatsApp delivery is in scope, verify valid Meta credentials and template behavior.

## Known Caveats

- Security and permissions review backlog is proposed for review.
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
