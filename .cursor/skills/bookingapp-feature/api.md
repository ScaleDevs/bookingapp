# BookingApp API

Paths below are relative to the repo root unless noted.

## Service files

Every domain lives in `apps/api/src/services/<kebab-name>/`. First argument is always `BaseService` (`{ requestId?, organizationId }` from oRPC context).

| File | Role |
| --- | --- |
| `queries.ts` | Reads only |
| `atomic.ts` | Single-entity writes and local invariants |
| `orchestration.ts` | Multi-step / cross-service writes |

Use orchestration only when create/update touches another service (for example booking create validating offering + customer). Most CRUD domains have no orchestration.

## Errors

Import from `@errors` only. Never throw `ORPCError` from a service. Routers do not try/catch.

```ts
import { NotFoundError, ConflictError } from "@errors";

throw new NotFoundError("Offering not found.");
throw new ConflictError("A schedule with these times already exists.");
```

Full pipeline: `apps/api/src/errors/ERRORS.md`.

## Contracts (`packages/api-contracts`)

Each domain folder:

```
schema.ts      # Valibot input/output schemas
contracts.ts   # oc procedures + OpenAPI meta
index.ts       # re-exports
```

```ts
export const list = oc
  .meta(
    meta.path(["offerings", "list"]),
    openapi({
      method: "GET",
      path: "/offerings",
      summary: "List offerings",
      tags: ["Offerings"],
    }),
  )
  .input(ListOfferingsInputSchema)
  .output(ListOfferingsOutputSchema);

export const offerings = { list, getById, create, update /* ... */ };
```

HTTP query coercion helpers live in `packages/api-contracts/src/http/coercion.ts`. Prefer oRPC Smart Coercion at the HTTP boundary.

Export the contract object and schemas from `packages/api-contracts/src/index.ts`.

## Router

```ts
const { authed } = createAuthenticatedImplementer(offeringsContract);

export const offeringRouter = authed.router({
  list: authed.list.handler(async ({ context, input }) => {
    return offeringQueries.list(context.service, input);
  }),
});
```

`createAuthenticatedImplementer` requires a session and non-empty `organizationId`. Call `atomic` for single-entity writes; call `orchestration` only when the write touches another service.

## Register a domain

1. `apps/api/src/architecture/manifest.ts` — add `{ basePath, apiPrefix: "/api" }`. Keep this file side-effect free.
2. `apps/api/src/routes/<camelName>/index.ts` — `defineDomain` + `mountOpenApiRouter`
3. `apps/api/src/routes/<camelName>/lambda.ts` — `createDomainLambdaHandler`
4. `apps/api/src/routes/registry.ts` — push onto `domains[]` (local dev)
5. `apps/api/src/routes/openapi-router.ts` — add the implemented router for `/openapi.json`

Auth is special: `routes/auth` mounts Better Auth at `/api/auth/*` and skips oRPC.

Local development composes every domain in `apps/api/src/create-app.ts`. Production deploys one Lambda per domain.

## Aliases

`@/*`, `@db`, `@errors`, `@services/*`, `@utils/*`. Prefer `@services/...` and `@utils/...`.
