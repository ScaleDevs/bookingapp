# BookingApp web guidance

- Keep Next.js App Router, existing routes, components, forms, and UX.
- Use `orpc` from `apps/web/lib/orpc/client.ts` with TanStack Query option helpers.
- Use `getORPCQueryUtils` for server-component prefetching and hydration.
- Invalidate queries through `useORPCUtils`; do not recreate endpoint-specific clients.
- Keep form-only validation local when it provides UI-specific messages; API validation remains authoritative in the shared Valibot contracts.
