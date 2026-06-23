"use client"

import { format } from "date-fns"
import {
  IconCalendar,
  IconPackage,
  IconPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
type WelcomeHeaderProps = {
  businessName?: string
  isLoading?: boolean
}

export function WelcomeHeader({ businessName, isLoading }: WelcomeHeaderProps) {
  const today = format(new Date(), "EEEE, MMMM d, yyyy")

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome back{businessName ? `, ${businessName}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm">
          <IconPlus />
          New Reservation
        </Button>
        <Button size="sm" variant="outline">
          <IconPackage />
          Add Offering
        </Button>
        <Button size="sm" variant="outline">
          <IconCalendar />
          View Calendar
        </Button>
      </div>
    </div>
  )
}
