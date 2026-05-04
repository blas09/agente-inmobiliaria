# Pre-Production Polish Requirements

Date: 2026-05-04

Status: proposed for grooming.

This document captures the requirements for the stage before preparing a production-like pilot environment.

The goal is to improve customer-facing perception and operator usability before deployment work starts, without opening self-service onboarding or broad product scope.

## Context

The MVP can be validated locally with caveats. The next larger milestone is to deploy a production-like pilot environment and test the product with a real tenant, including real WhatsApp provider behavior.

Before that deployment phase, the product needs a focused polish pass:

- reduce overloaded internal screens
- improve role-specific navigation behavior
- add a commercial landing/index page
- enrich seed data to simulate more realistic operational volume

## Product Decision

The system is not ready for independent self-service signup by a real estate agency.

Current expected model:

- tenant creation is manual or platform-admin managed
- tenant configuration is supervised
- initial users and roles are assigned by admin flow
- customer data is loaded in a controlled way
- onboarding is runbook-driven

The public/commercial index must not promise automatic signup. It should communicate the product value and route interested agencies to a manual demo/contact flow.

## In Scope

### UI/UX Polish Round 2

Focus pages:

- `/dashboard/leads/ffffffff-ffff-4fff-8fff-ffffffffffff`
- `/dashboard/channels`
- `/dashboard/settings`
- `/dashboard` for advisor users

Expected outcome:

- reduce perceived density
- improve hierarchy and scannability
- group secondary information behind clearer sections, tabs, drawers, or progressive disclosure where appropriate
- preserve existing visual direction
- keep Spanish UI copy
- avoid broad redesign

### Platform Admin Navigation

Problem:

When a platform admin has no active tenant, the sidebar shows tenant-operational routes that redirect back to `/dashboard/platform/tenants`.

Expected outcome:

- hide tenant-operational navigation items for platform admins without an active tenant
- show only platform-relevant navigation in that state
- avoid showing actions that immediately redirect due to missing tenant permission

### Commercial Index

Problem:

The root route currently behaves as an auth redirect. There is no commercial index explaining what the platform does.

Expected outcome:

- create a public commercial index for unauthenticated visitors
- explain the platform's value proposition for real estate agencies
- show core workflow: properties, leads, conversations, visits, follow-up
- make clear this is a supervised/demo-oriented product at this stage
- include a CTA for manual demo/contact, not self-service signup
- authenticated users can still access the dashboard

### Richer Seed Data

Problem:

Current seeds are too small to evaluate UI behavior under realistic operational density.

Expected outcome:

- add more properties, leads, conversations, messages, appointments, FAQs, channel events, and possibly template states
- preserve deterministic IDs and valid UUIDs
- keep data tenant-scoped
- include enough variation to test lists, dashboards, detail pages, empty/non-empty states, overloaded sections, and recent activity
- do not add external dependencies or real credentials

## Out Of Scope

- self-service tenant signup
- billing
- public account creation for agencies
- production deployment
- real Meta WhatsApp integration setup
- broad visual redesign
- new large product modules
- automated imports
- changing authorization model

## UX Principles For This Stage

- Prefer progressive disclosure over showing every operational detail at once.
- Keep primary actions visible and secondary actions available but less dominant.
- Reduce repeated summary cards when the same information appears nearby.
- Prefer tabs, compact panels, side sheets, and grouped sections when a screen has multiple workflows.
- Preserve operational density where useful, but improve visual hierarchy.
- Optimize advisor dashboard for action and follow-up, not admin-level overview.
- Avoid hiding critical errors, caveats, or permissions behind purely decorative UI.

## Acceptance Criteria

- Requirements are groomed into an executable backlog before implementation.
- Each task identifies affected pages, owner roles, scope, out-of-scope items, acceptance criteria, and verification.
- No code implementation starts until backlog review is accepted.
- The commercial index does not imply self-service signup.
- Richer seeds remain safe for local/demo use and contain no real secrets.

## Specialist Review Needed

### Product Owner

- Confirm this stage is required before production-like pilot setup.
- Confirm landing page messaging and no self-service signup promise.
- Confirm scope does not distract from pilot readiness.

### Project Manager

- Split requirements into ordered tasks.
- Define dependencies and completion criteria.
- Keep implementation sequence controlled.

### UI/UX Specialist

- Evaluate the identified overloaded screens.
- Decide whether tabs, drawers, progressive disclosure, layout restructuring, or content reduction best fits each page.
- Define the landing page structure and tone.

### Project Leader / Technical Lead

- Define technical impact by area.
- Keep implementation constrained to UI/layout, navigation permissions, and seed data unless a blocker appears.

### Frontend Engineer

- Implement accepted UI changes using existing components and visual patterns.

### QA Engineer / Test Agent

- Define manual checks for each target route and role.
- Validate richer seeds and role-specific navigation.

### Commercial Domain

- Validate seed realism, landing messaging, and operational workflows.
