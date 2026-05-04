# Current Pending Work

This file tracks what remains after completing the scoped MVP backlog.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

## Current Release State

Status: internal manual testing completed; preparing the path toward a supervised customer MVP.

Reference:

- [Internal Pilot Checklist](./internal-pilot-checklist.md)
- [MVP Path To Customer Use](./mvp-path.md)
- [UI/UX MVP Polish Backlog](./ui-ux-backlog.md)
- [Operational MVP Readiness Backlog](./operational-readiness-backlog.md)

The implementation backlog for the first MVP cut is complete. The UI/UX MVP polish backlog is complete. The current proposed next phase is operational readiness for a supervised customer pilot.

## Required Before Customer-Facing MVP

1. Review and approve `operational-readiness-backlog.md`.
2. Execute approved operational readiness tasks one by one.
3. Complete the security, onboarding, and pilot readiness groomings defined in `mvp-path.md`.
4. Confirm whether real WhatsApp provider delivery is part of the first customer pilot.
5. If real WhatsApp delivery is in scope, verify valid Meta credentials and template behavior.

## Known Caveats

- Operational readiness backlog is proposed for review.
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
