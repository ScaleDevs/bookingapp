"use client"

import { format, parseISO } from "date-fns"
import { IconCalendarEvent } from "@tabler/icons-react"

import { DashboardWidget } from "@/app/dashboard/_components/dashboard/dashboard-widget"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReservationStatus, UpcomingReservation } from "@/hooks/dashboard/types"
import { cn } from "@/lib/utils"

const statusVariant: Record<
  ReservationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "default",
  pending: "outline",
  cancelled: "destructive",
}

type UpcomingReservationsTableProps = {
  reservations: UpcomingReservation[] | null
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  isEmpty?: boolean
  onRetry?: () => void
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function UpcomingReservationsTable({
  reservations,
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
}: UpcomingReservationsTableProps) {
  return (
    <DashboardWidget
      title="Upcoming Reservations"
      description="Reservations scheduled for the next few days"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={isEmpty}
      emptyIcon={<IconCalendarEvent />}
      emptyTitle="No upcoming reservations"
      emptyDescription="New bookings will appear here once customers schedule sessions."
      onRetry={onRetry}
      loadingContent={<TableSkeleton />}
      contentClassName="px-0"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Offering</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations?.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.customer}</TableCell>
              <TableCell className="hidden max-w-[200px] truncate sm:table-cell">
                {reservation.offering}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="sm:hidden">{reservation.offering} · </span>
                {format(parseISO(reservation.date), "MMM d, h:mm a")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusVariant[reservation.status]}
                  className={cn("capitalize")}
                >
                  {reservation.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardWidget>
  )
}
