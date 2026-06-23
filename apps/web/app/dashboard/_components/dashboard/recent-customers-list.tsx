"use client"

import { format, parseISO } from "date-fns"
import { IconUsers } from "@tabler/icons-react"

import { DashboardWidget } from "@/app/dashboard/_components/dashboard/dashboard-widget"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import type { RecentCustomer } from "@/hooks/dashboard/types"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

type RecentCustomersListProps = {
  customers: RecentCustomer[] | null
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  isEmpty?: boolean
  onRetry?: () => void
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RecentCustomersList({
  customers,
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
}: RecentCustomersListProps) {
  return (
    <DashboardWidget
      title="Recent Customers"
      description="Customers who booked recently"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={isEmpty}
      emptyIcon={<IconUsers />}
      emptyTitle="No customers yet"
      emptyDescription="Your most recent customers will show up here."
      onRetry={onRetry}
      loadingContent={<ListSkeleton />}
    >
      <ul className="flex flex-col gap-4">
        {customers?.map((customer) => (
          <li key={customer.id} className="flex items-center gap-3">
            <Avatar size="lg">
              {customer.avatarUrl ? (
                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
              ) : null}
              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{customer.name}</p>
              <p className="text-sm text-muted-foreground">
                Last reservation{" "}
                {format(parseISO(customer.lastReservation), "MMM d, yyyy")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardWidget>
  )
}
