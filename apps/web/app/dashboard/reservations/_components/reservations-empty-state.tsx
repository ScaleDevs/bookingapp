"use client"

import { IconCalendarEvent } from "@tabler/icons-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function ReservationsEmptyState() {
  return (
    <div className="px-4 lg:px-6">
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCalendarEvent />
          </EmptyMedia>
          <EmptyTitle>No reservations yet</EmptyTitle>
          <EmptyDescription>
            Reservations will appear here once customers start booking your
            offerings.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
