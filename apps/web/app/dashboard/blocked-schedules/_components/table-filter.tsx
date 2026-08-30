"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconPlus, IconX } from "@tabler/icons-react"

import { useFilters } from "@/app/dashboard/blocked-schedules/_providers/filters-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TableFilters } from "@/app/dashboard/blocked-schedules/_providers/filters-context"
import { cn } from "@/lib/utils"
import { orpc } from "@/lib/orpc/client"

export function filtersToListInput(filters: TableFilters) {
  const reason = filters.reason?.trim()
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : undefined
  const dateTo = filters.dateTo ? new Date(filters.dateTo) : undefined

  return {
    reason: reason && reason.length > 0 ? reason : undefined,
    dateFrom,
    dateTo,
  }
}

type Step = "field" | "offering" | "reason" | "dateFrom" | "dateTo"

export function TableFilter() {
  const { filters, setFilters } = useFilters()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("field")

  const [offeringValue, setOfferingValue] = useState("")
  const [reason, setReason] = useState(filters.reason ?? "")
  const [dateFrom, setDateFrom] = useState(filters.dateFrom ?? "")
  const [dateTo, setDateTo] = useState(filters.dateTo ?? "")

  const offeringsQuery = useQuery(
    orpc.offerings.getSelectOptions.queryOptions({ input: {} })
  )

  const offerings = offeringsQuery.data ?? []
  const selectedOffering = offerings.find((o) => o.value === filters.offeringId)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setStep("field")
  }

  const removeOffering = () => {
    const next = { ...filters }
    delete next.offeringId
    setFilters(next)
  }

  const removeReason = () => {
    const next = { ...filters }
    delete next.reason
    setFilters(next)
  }

  const removeDateFrom = () => {
    const next = { ...filters }
    delete next.dateFrom
    setFilters(next)
  }

  const removeDateTo = () => {
    const next = { ...filters }
    delete next.dateTo
    setFilters(next)
  }

  const applyOffering = () => {
    setFilters({ ...filters, offeringId: offeringValue })
    setOpen(false)
  }

  const applyReason = () => {
    setFilters({ ...filters, reason })
    setOpen(false)
  }

  const applyDateFrom = () => {
    setFilters({ ...filters, dateFrom })
    setOpen(false)
  }

  const applyDateTo = () => {
    setFilters({ ...filters, dateTo })
    setOpen(false)
  }

  const offeringBadgeLabel = selectedOffering
    ? `Offering is ${selectedOffering.label}`
    : null

  const reasonBadgeLabel = filters.reason
    ? `Reason contains "${filters.reason}"`
    : null
  const dateFromBadgeLabel = filters.dateFrom
    ? `From ${filters.dateFrom}`
    : null
  const dateToBadgeLabel = filters.dateTo ? `To ${filters.dateTo}` : null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {offeringBadgeLabel && (
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground"
          )}
        >
          <span className="truncate">{offeringBadgeLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Remove offering filter"
            onClick={removeOffering}
          >
            <IconX className="size-3.5" />
          </Button>
        </span>
      )}

      {reasonBadgeLabel && (
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground"
          )}
        >
          <span className="truncate">{reasonBadgeLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Remove reason filter"
            onClick={removeReason}
          >
            <IconX className="size-3.5" />
          </Button>
        </span>
      )}

      {dateFromBadgeLabel && (
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground"
          )}
        >
          <span className="truncate">{dateFromBadgeLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Remove date from filter"
            onClick={removeDateFrom}
          >
            <IconX className="size-3.5" />
          </Button>
        </span>
      )}

      {dateToBadgeLabel && (
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground"
          )}
        >
          <span className="truncate">{dateToBadgeLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Remove date to filter"
            onClick={removeDateTo}
          >
            <IconX className="size-3.5" />
          </Button>
        </span>
      )}

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 border-dashed"
              aria-expanded={open}
            />
          }
        >
          <IconPlus className="size-4" />
          Add filter
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={8}
          className={cn("w-[min(100vw-2rem,20rem)] rounded-lg")}
        >
          {step === "field" && (
            <div className="flex flex-col gap-0.5">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Filter by
              </p>
              <Button
                type="button"
                variant="ghost"
                className={cn("flex justify-start pl-2")}
                disabled={!!filters.offeringId}
                onClick={() => {
                  setOfferingValue("")
                  setStep("offering")
                }}
              >
                Offering
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn("flex justify-start pl-2")}
                disabled={!!filters.reason}
                onClick={() => {
                  setReason("")
                  setStep("reason")
                }}
              >
                Reason
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn("flex justify-start pl-2")}
                disabled={!!filters.dateFrom}
                onClick={() => {
                  setDateFrom("")
                  setStep("dateFrom")
                }}
              >
                Date From
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn("flex justify-start pl-2")}
                disabled={!!filters.dateTo}
                onClick={() => {
                  setDateTo("")
                  setStep("dateTo")
                }}
              >
                Date To
              </Button>
            </div>
          )}

          {step === "offering" && (
            <div className="space-y-4">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="mb-3 text-muted-foreground"
                  onClick={() => setStep("field")}
                >
                  ← Back
                </Button>
                <p className="text-sm font-medium">Offering</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">
                  Select offering
                </span>
                <Select
                  value={offeringValue}
                  onValueChange={(value) => setOfferingValue(value ?? "")}
                  items={offerings}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an offering" />
                  </SelectTrigger>
                  <SelectContent>
                    {offerings.map((offering) => (
                      <SelectItem key={offering.value} value={offering.value}>
                        {offering.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={applyOffering}
                  disabled={!offeringValue}
                >
                  Apply filter
                </Button>
              </div>
            </div>
          )}

          {step === "reason" && (
            <div className="space-y-4">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="mb-3 text-muted-foreground"
                  onClick={() => setStep("field")}
                >
                  ← Back
                </Button>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-xs text-muted-foreground">
                  Filter by reason text
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Contains</span>
                <Input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Search by reason"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      applyReason()
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={applyReason}>
                  Apply filter
                </Button>
              </div>
            </div>
          )}

          {step === "dateFrom" && (
            <div className="space-y-4">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="mb-3 text-muted-foreground"
                  onClick={() => setStep("field")}
                >
                  ← Back
                </Button>
                <p className="text-sm font-medium">Date From</p>
                <p className="text-xs text-muted-foreground">
                  Show blocked times starting from this date
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Date</span>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      applyDateFrom()
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={applyDateFrom}>
                  Apply filter
                </Button>
              </div>
            </div>
          )}

          {step === "dateTo" && (
            <div className="space-y-4">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="mb-3 text-muted-foreground"
                  onClick={() => setStep("field")}
                >
                  ← Back
                </Button>
                <p className="text-sm font-medium">Date To</p>
                <p className="text-xs text-muted-foreground">
                  Show blocked times ending before this date
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Date</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      applyDateTo()
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={applyDateTo}>
                  Apply filter
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
