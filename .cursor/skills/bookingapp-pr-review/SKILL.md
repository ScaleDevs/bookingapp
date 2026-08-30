---
name: bookingapp-pr-review
description: Review BookingApp changes for contract safety, authorization, domain boundaries, and deployment risk.
---

# BookingApp pull-request review

Check:

- API inputs and outputs are defined in `packages/api-contracts` with Valibot.
- Protected operations require a Better Auth session and active organization.
- Reads, atomic writes, and cross-domain workflows remain in the appropriate service files.
- Every organization-owned query is scoped to the active organization.
- Next.js changes preserve existing routes, state, components, and user experience.
- No secrets, production domains, or destructive SST changes were introduced.
- `pnpm check-types`, lint, tests, API build, and web build results are recorded.
