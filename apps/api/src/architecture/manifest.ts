/**
 * Single source of truth for which domains are registered in the API, and
 * which base path each one owns.
 *
 * This file must stay free of side effects and runtime dependencies (env,
 * db, auth, hono, etc.) so it can be imported by both application code
 * (`routes/**`) and SST infrastructure code (`infra/**`) without pulling
 * in the rest of the app.
 *
 * To onboard a new domain:
 * 1. Add an entry here.
 * 2. Create `routes/<name>/index.ts` exporting a `DomainDefinition` (see `domain.ts`).
 * 3. Create `routes/<name>/lambda.ts` (see `lambda.ts`).
 * 4. Add the domain to `routes/registry.ts`.
 *
 * Infrastructure (`infra/domains.ts`) derives its API Gateway routes and
 * Lambda handlers from this manifest automatically.
 */
export const DOMAIN_MANIFEST = {
  auth: {
    basePath: "/api/auth",
    apiPrefix: "/api/auth",
  },
  organization: {
    basePath: "/api/organizations",
    apiPrefix: "/api",
  },
  offering: {
    basePath: "/api/offerings",
    apiPrefix: "/api",
  },
  offeringSchedule: {
    basePath: "/api/offering-schedules",
    apiPrefix: "/api",
  },
  blockedTime: {
    basePath: "/api/blocked-times",
    apiPrefix: "/api",
  },
  customer: {
    basePath: "/api/customers",
    apiPrefix: "/api",
  },
  booking: {
    basePath: "/api/bookings",
    apiPrefix: "/api",
  },
  system: {
    basePath: "/api/system",
    apiPrefix: "/api",
  },
} as const;

export type DomainName = keyof typeof DOMAIN_MANIFEST;
