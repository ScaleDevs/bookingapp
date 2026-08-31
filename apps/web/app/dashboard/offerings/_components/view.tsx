import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { offerings } from "@bookingapp/api-contracts"

import type { ContractOutputs } from "@/lib/contract-types"

type Offering = ContractOutputs<typeof offerings>["getById"]

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${remainingMinutes} min`
}

type ViewProps = {
  offering: Offering | undefined
  isLoading: boolean
}

export function View({ offering, isLoading }: ViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!offering) {
    return null
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Name</label>
        <p className="text-sm text-muted-foreground">{offering.name}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description
        </label>
        <p className="text-sm text-muted-foreground">
          {offering.description || "No description provided"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Duration
          </label>
          <p className="text-sm text-muted-foreground">
            {formatDuration(Number(offering.durationMinutes))}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Capacity
          </label>
          <p className="text-sm text-muted-foreground">{offering.capacity}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Price</label>
        <p className="text-sm text-muted-foreground">
          ${Number(offering.price || 0).toFixed(2)}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Status</label>
        <div>
          <Badge
            variant={offering.isActive ? "default" : "secondary"}
            className={cn("capitalize")}
          >
            {offering.isActive ? "Active" : "Archived"}
          </Badge>
        </div>
      </div>
    </div>
  )
}
