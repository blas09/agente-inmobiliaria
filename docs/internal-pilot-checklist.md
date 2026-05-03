# Internal Pilot Checklist

Date: 2026-05-03

Status: ready for disciplined internal testing with caveats.

This checklist closes the scoped MVP execution pass for:

`property -> lead -> conversation -> visit -> follow-up`

It does not declare the product ready for unsupervised customers.

## Target Environment

Recommended first test environment:

- local development environment
- local Supabase stack from `supabase/config.toml`
- Next.js app on `http://127.0.0.1:3003`
- seeded tenant: `demo-paraguay`

Local Supabase ports:

- API: `55421`
- Postgres: `55422`
- Studio: `55423`
- Inbucket: `55424`

## Required Environment Variables

Minimum for local authenticated testing:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Required only for real provider behavior:

- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_CLOUD_API_VERSION`
- `WHATSAPP_CREDENTIALS_JSON`
- `RESEND_API_KEY`
- `AI_PROVIDER`
- `AI_API_KEY`

MVP caveat:

- Real Meta outbound delivery and template approval/sync require valid provider credentials.
- Without provider credentials, WhatsApp UI and internal event/error handling can be tested, but real external delivery cannot be declared verified.

## Seed Accounts

- `owner@demo.py` / `Password123!`
- `tenantadmin@demo.py` / `Password123!`
- `advisor@demo.py` / `Password123!`
- `operator@demo.py` / `Password123!`
- `viewer@demo.py` / `Password123!`
- `admin@platform.local` / `Password123!`

## Automated Checks

Required before internal testing:

- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/eslint .`
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/vitest run`
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/tsc --noEmit -p tsconfig.typecheck.json`
- `source ~/.nvm/nvm.sh && nvm use && ./node_modules/.bin/next build --webpack`

Current result:

- lint passed
- tests passed
- typecheck passed
- build passed

## MVP Walkthrough

Use `owner@demo.py` first, then repeat permission-sensitive actions with `advisor@demo.py` and `viewer@demo.py`.

1. Login and confirm active tenant.
2. Open dashboard and confirm commercial reporting renders.
3. Open properties and inspect an existing property.
4. Create or edit a property if using an operational role.
5. Open leads and inspect an existing lead.
6. Create or edit a lead if using an operational role.
7. Open conversations and inspect a conversation.
8. Link conversation to lead and property.
9. Send a manual reply or verify the provider-credential caveat if real WhatsApp delivery is not configured.
10. Schedule a visit from the lead or conversation.
11. Confirm, cancel, and review visit state from the agenda.
12. Confirm the visit appears from related lead/property context.
13. Review dashboard reporting after state changes.

Current result:

- code-level route/build audit passed
- authenticated browser walkthrough still needs to be executed during the internal testing session

## Known Issues

### Pilot Blockers

- None identified by automated checks and code-level audit.

### Internal-Test Caveats

- Authenticated browser walkthrough still needs to be performed with seed users.
- Real WhatsApp delivery requires valid Meta credentials.
- Real Meta template approval/sync remains out of scope.
- No persistent distributed rate limiter is implemented for public endpoints.

### Post-MVP

- Billing.
- Self-service onboarding.
- Google Calendar integration.
- Advanced AI.
- Full omnichannel support.
- Advanced reports and management dashboards.
- Rich property media.
- Tenant branding.

## Release Decision

The scoped MVP is ready for a disciplined internal testing round with the caveats above.

Do not call it ready for unsupervised customer use until:

- the authenticated browser walkthrough is completed
- any issues found during that walkthrough are classified
- real WhatsApp provider behavior is verified or explicitly excluded from the pilot
