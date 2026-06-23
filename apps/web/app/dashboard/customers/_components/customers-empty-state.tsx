"use client"

import { IconUsers } from "@tabler/icons-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function CustomersEmptyState() {
  return (
    <div className="px-4 lg:px-6">
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUsers />
          </EmptyMedia>
          <EmptyTitle>No customers yet</EmptyTitle>
          <EmptyDescription>
            Customers will appear here once they book your offerings.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
