import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getTRPCQueryUtils } from "@/lib/trpc/server"
import { FiltersProvider } from "@/app/dashboard/blocked-schedules/_providers/filters-context"
import { Header } from "@/app/dashboard/blocked-schedules/_components/header"
import { Table } from "@/app/dashboard/blocked-schedules/_components/table"
import { Suspense } from "react"

const HydratedHeaderAndFilters = async () => {
  const { trpc, queryClient } = await getTRPCQueryUtils()

  await trpc.offerings.getSelectOptions.prefetch()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
    </HydrationBoundary>
  )
}

export default async function Page() {
  return (
    <FiltersProvider>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense fallback={<></>}>
              <HydratedHeaderAndFilters />
            </Suspense>
            <Table />
          </div>
        </div>
      </div>
    </FiltersProvider>
  )
}
