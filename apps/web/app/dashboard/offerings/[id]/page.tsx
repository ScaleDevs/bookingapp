import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import { getTRPCQueryUtils } from "@/lib/trpc/server"
import { EditSheetProvider } from "./_provider/edit-sheet-provider"
import { DetailsSection } from "./_components/details-section"
import { SchedulesTable } from "./_components/schedules-table"
import { EditSheet } from "./_components/edit-sheet"
import { CreateScheduleSheet } from "./_components/create-schedule-sheet"

type PageProps = {
  params: Promise<{ id: string }>
}

async function SchedulesServerWrapper({ offeringId }: { offeringId: string }) {
  const { trpc, queryClient } = await getTRPCQueryUtils()

  await trpc.offeringSchedules.list.prefetch({
    offeringId,
    page: 1,
    pageSize: 10,
    sortOrder: "asc",
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">Schedules</h2>
            <CreateScheduleSheet offeringId={offeringId} />
          </div>
          <SchedulesTable offeringId={offeringId} />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default async function OfferingDetailsPage({ params }: PageProps) {
  const { id: offeringId } = await params

  if (!offeringId) {
    notFound()
  }

  const { trpc, queryClient } = await getTRPCQueryUtils()

  await trpc.offerings.getById.prefetch({ id: offeringId })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditSheetProvider>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DetailsSection offeringId={offeringId} />

              <SchedulesServerWrapper offeringId={offeringId} />
            </div>
          </div>
        </div>

        <EditSheet offeringId={offeringId} />
      </EditSheetProvider>
    </HydrationBoundary>
  )
}
