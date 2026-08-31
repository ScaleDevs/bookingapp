# BookingApp web

Keep Next.js App Router, existing routes, components, forms, and UX. Do not migrate toward KardOps Vite / TanStack Router layouts.

## oRPC client

Named clients live in `apps/web/lib/orpc/client.ts` (`OpenAPILink` against `/api`, `createUtils(contract)`). Call them directly — do not wrap them in a nested `orpc` object.

```ts
import { offeringClient } from "@/lib/orpc/client"

useQuery(offeringClient.list.queryOptions({ input: { page, pageSize, sortOrder: "desc" } }))
useMutation(offeringClient.create.mutationOptions())
```

Types come from the contract, not a combined `APIOutputs` map:

```ts
import { offerings } from "@bookingapp/api-contracts"
import type { ContractOutputs } from "@/lib/contract-types"

type ListItem = ContractOutputs<typeof offerings>["list"]["items"][number]
```

Invalidate the whole domain client after mutations:

```ts
void queryClient.invalidateQueries({ queryKey: offeringClient.key() })
```

Server-component prefetching uses `getORPCQueryUtils` from `apps/web/lib/orpc/server.ts` (cookie-forwarding OpenAPILink) and the same named clients.

Keep form-only validation local when it provides UI-specific messages; API validation remains authoritative in the shared Valibot contracts.

In development, Next.js rewrites `/api/:path*` to the API origin so cookies stay same-origin. Production uses `NEXT_PUBLIC_BASE_API_URL`.
