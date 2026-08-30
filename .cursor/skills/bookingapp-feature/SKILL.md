---
name: bookingapp-feature
description: Build BookingApp features across the shared oRPC contract, API domain services, and Next.js web app.
---

# BookingApp feature workflow

Use this skill when implementing a user-facing BookingApp feature.

1. Start at `packages/api-contracts/src/index.ts` and define Valibot input/output schemas and oRPC route metadata.
2. Implement API behavior in `apps/api/src/router.ts` by delegating to domain services.
3. Keep read-only database access in a domain `queries.ts`, focused writes and invariants in `atomic.ts`, and cross-domain workflows in `orchestration.ts`.
4. Use the existing Better Auth session and active organization context for authorization.
5. Consume the contract from the Next.js app with `@orpc/tanstack-query`; do not add a second API client or alter Next.js routing.
6. Verify the shared contract, API, and web typechecks before changing unrelated UI.

BookingApp domains are offerings, offering schedules, blocked times, bookings, customers, and organizations. Preserve existing booking, availability, pricing, and authentication semantics.
