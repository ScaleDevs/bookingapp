"use client"

import { RecentActivityFeed } from "@/app/dashboard/_components/dashboard/recent-activity-feed"
import { RecentCustomersList } from "@/app/dashboard/_components/dashboard/recent-customers-list"
import { StatsCards } from "@/app/dashboard/_components/dashboard/stats-cards"
import { UpcomingReservationsTable } from "@/app/dashboard/_components/dashboard/upcoming-reservations-table"
import { WelcomeHeader } from "@/app/dashboard/_components/dashboard/welcome-header"
import { useDashboardStats } from "@/hooks/dashboard/use-dashboard-stats"
import { useRecentCustomers } from "@/hooks/dashboard/use-recent-customers"
import { useUpcomingReservations } from "@/hooks/dashboard/use-upcoming-reservations"

export function DashboardContent() {
  const statsQuery = useDashboardStats()
  const upcomingQuery = useUpcomingReservations()
  const customersQuery = useRecentCustomers()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <WelcomeHeader
            businessName={statsQuery.data?.businessName}
            isLoading={statsQuery.isLoading}
          />

          <StatsCards
            stats={statsQuery.data}
            isLoading={statsQuery.isLoading}
            isError={statsQuery.isError}
            error={statsQuery.error}
            onRetry={statsQuery.refetch}
          />

          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <UpcomingReservationsTable
                reservations={upcomingQuery.data}
                isLoading={upcomingQuery.isLoading}
                isError={upcomingQuery.isError}
                error={upcomingQuery.error}
                isEmpty={upcomingQuery.isEmpty}
                onRetry={upcomingQuery.refetch}
              />
            </div>
            <RecentCustomersList
              customers={customersQuery.data}
              isLoading={customersQuery.isLoading}
              isError={customersQuery.isError}
              error={customersQuery.error}
              isEmpty={customersQuery.isEmpty}
              onRetry={customersQuery.refetch}
            />
          </div>

          <div className="px-4 lg:px-6">
            <RecentActivityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
