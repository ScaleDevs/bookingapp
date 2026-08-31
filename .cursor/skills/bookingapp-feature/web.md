# BookingApp web

Keep Next.js App Router, existing routes, components, forms, and UX. Do not migrate toward KardOps Vite / TanStack Router layouts.

## oRPC client

Clients are created in `apps/web/lib/orpc/client.ts` with `OpenAPILink` against `/api` and `createUtils(contract)`. Existing pages use the nested `orpc` object:

```ts
orpc.offerings.list.queryOptions({ input: { page, pageSize, sortOrder: "desc" } })
orpc.offerings.create.mutationOptions()
```

Server-component prefetching uses `getORPCQueryUtils` from `apps/web/lib/orpc/server.ts` and forwards the Better Auth cookie.

Invalidate with `useORPCUtils` or `queryClient.invalidateQueries({ queryKey: orpc.offerings.list.key() })`.

Keep form-only validation local when it provides UI-specific messages; API validation remains authoritative in the shared Valibot contracts.

In development, Next.js rewrites `/api/:path*` to the API origin so cookies stay same-origin. Production uses `NEXT_PUBLIC_BASE_API_URL`.
