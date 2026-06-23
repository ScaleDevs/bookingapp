"use client"

import { formatDistanceToNow, parseISO } from "date-fns"
import {
  IconActivity,
  IconCalendarEvent,
  IconPackage,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react"

import { DashboardWidget } from "@/app/dashboard/_components/dashboard/dashboard-widget"
import { mockRecentActivity } from "@/hooks/dashboard/mock-data"
import type { ActivityItem } from "@/hooks/dashboard/types"
import { useMockQuery } from "@/hooks/dashboard/use-mock-query"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

const activityIcons = {
  reservation: IconCalendarEvent,
  cancellation: IconX,
  customer: IconUserPlus,
  offering: IconPackage,
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-9 shrink-0 rounded-md" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RecentActivityFeed() {
  const { data, isLoading, isError, error, isEmpty, refetch } = useMockQuery<
    ActivityItem[]
  >({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/dashboard/activity
      return mockRecentActivity
    },
    isEmpty: (items) => items.length === 0,
  })

  return (
    <DashboardWidget
      title="Recent Activity"
      description="Latest updates across your business"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={isEmpty}
      emptyIcon={<IconActivity />}
      emptyTitle="No recent activity"
      emptyDescription="Activity from reservations and customers will appear here."
      onRetry={refetch}
      loadingContent={<FeedSkeleton />}
    >
      <ItemGroup>
        {data?.map((item) => {
          const Icon = activityIcons[item.type]

          return (
            <Item key={item.id} size="sm" variant="muted">
              <ItemMedia variant="icon">
                <Icon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.message}</ItemTitle>
                <ItemDescription>
                  {formatDistanceToNow(parseISO(item.timestamp), {
                    addSuffix: true,
                  })}
                </ItemDescription>
              </ItemContent>
            </Item>
          )
        })}
      </ItemGroup>
    </DashboardWidget>
  )
}
