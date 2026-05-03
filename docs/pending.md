# Current Pending Work

This file tracks what remains after completing the scoped MVP backlog.

Current MVP flow:

`property -> lead -> conversation -> visit -> follow-up`

## Current Release State

Status: ready for disciplined internal testing with caveats.

Reference:

- [Internal Pilot Checklist](./internal-pilot-checklist.md)

The implementation backlog for the first MVP cut is complete. The next work is validation, not feature expansion.

## Required Before Calling The MVP Internally Verified

1. Run the authenticated browser walkthrough with seed users.
2. Classify any issue found as `pilot blocker`, `non-blocker`, or `post-MVP`.
3. Confirm whether real WhatsApp provider delivery is part of the pilot.
4. If real WhatsApp delivery is in scope, verify valid Meta credentials and template behavior.
5. Update this file and `mvp-status.md` after the walkthrough.

## Known Caveats

- Authenticated browser walkthrough is pending.
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
