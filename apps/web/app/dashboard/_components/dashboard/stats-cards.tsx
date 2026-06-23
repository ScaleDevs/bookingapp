"use client"

import {
  IconCalendarEvent,
  IconPackage,
  IconTicket,
  IconUsers,
} from "@tabler/icons-react"

import {
  DashboardStatsSkeleton,
  DashboardWidget,
} from "@/app/dashboard/_components/dashboard/dashboard-widget"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardStats } from "@/hooks/dashboard/types"

const statConfig = [
  {
    key: "totalReservations" as const,
    label: "Total Reservations",
    icon: IconTicket,
  },
  {
    key: "upcomingReservations" as const,
    label: "Upcoming Reservations",
    icon: IconCalendarEvent,
  },
  {
    key: "activeOfferings" as const,
    label: "Active Offerings",
    icon: IconPackage,
  },
  {
    key: "totalCustomers" as const,
    label: "Total Customers",
    icon: IconUsers,
  },
]

type StatsCardsProps = {
  stats: DashboardStats | null
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
}

export function StatsCards({
  stats,
  isLoading,
  isError,
  error,
  onRetry,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="px-4 lg:px-6">
        <DashboardStatsSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-4 lg:px-6">
        <DashboardWidget
          title="Overview"
          isError
          error={error}
          onRetry={onRetry}
          className="border-none shadow-none ring-0"
        >
          <span />
        </DashboardWidget>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {statConfig.map(({ key, label, icon: Icon }) => (
        <Card key={key} className="@container/card">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Icon className="size-4" />
              {label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats[key].toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
