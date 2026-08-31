---
name: bookingapp-feature
description: Build BookingApp features across the shared oRPC contract, API domain services, and Next.js web app.
---

# BookingApp feature work

BookingApp is a pnpm + Turborepo monorepo. Features are vertical slices: **contract → API → web**. Copy a neighbor domain. Do not invent new stacks. Keep Next.js App Router, existing routes, components, and UX.

This skill is the implementation entry point. Read a specialized skill when the work hits that layer.

| Work | Skill |
| --- | --- |
| Schema, indexes, migrations, seeds | `bookingapp-database` |
| Availability, pricing, booking invariants | `bookingapp-domain-modeling` |
| Linear issue → plan → PR-ready summary | `bookingapp-linear-implementation` |
| Reviewing a changeset before merge | `bookingapp-pr-review` |
| SST stages, GitHub Actions, secrets, domains | `bookingapp-deployment` |

## Stack (do not substitute)

| Layer | Use | Do not use |
| --- | --- | --- |
| Contracts | Valibot + `@orpc/contract` in `packages/api-contracts` | Zod for API contracts |
| API | Hono + oRPC OpenAPI in `apps/api` | tRPC, Express |
| DB | Drizzle + PostgreSQL | Prisma |
| Web | Next.js App Router + TanStack Query | Vite, TanStack Router |
| Auth | Better Auth, cookie session, organization plugin | JWT in localStorage |
| UI | Tailwind + shadcn in `apps/web` | KardOps Vite/feature folder layout |

Package filters: `api` (backend), `web` (frontend).

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Contract folder / REST path | kebab-case plural | `offering-schedules`, `/offering-schedules` |
| Contract export | camelCase plural | `offeringSchedules` |
| Manifest + route folder | camelCase singular | `offeringSchedule` → `apps/api/src/routes/offeringSchedule/` |
| Service folder | kebab-case | `apps/api/src/services/offering-schedules/` |

Tenant scope comes from `context.service.organizationId` (Better Auth active org). Never trust a client-supplied `organizationId`.

## New-domain checklist

```
- [ ] Tables + relations (follow bookingapp-database)
- [ ] Valibot schemas + oc contracts in packages/api-contracts/src/<kebab-plural>/
- [ ] Export from packages/api-contracts/src/index.ts
- [ ] Service: queries.ts, atomic.ts [, orchestration.ts]
- [ ] Route: apps/api/src/routes/<camelName>/{index,router,lambda}.ts
- [ ] Register: architecture/manifest.ts, routes/registry.ts, routes/openapi-router.ts
- [ ] Web: consume via named clients in apps/web/lib/orpc/client.ts (`offeringClient.list.queryOptions`, etc.)
```

Infra Lambdas are derived from `DOMAIN_MANIFEST` — do not hand-edit SST routes. Route folder name **must** match the manifest key (`src/routes/${manifestKey}/lambda.handler`).

## Commands

```bash
pnpm --filter api check-types
pnpm --filter web check-types
pnpm --filter @bookingapp/api-contracts check-types
```

## Additional resources

- API, contracts, errors, and service files: [api.md](api.md)
- Next.js oRPC client and call sites: [web.md](web.md)
