"use client"

import { useState } from "react"
import { IconPlus, IconX } from "@tabler/icons-react"

import { useFilters } from "@/app/dashboard/offerings/_providers/filters-context"

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
import type { TableFilters } from "@/app/dashboard/offerings/_providers/filters-context"
import { cn } from "@/lib/utils"

export function filtersToListInput(filters: TableFilters) {
  let isActive: boolean | undefined

  if (filters.status === "active") {
    isActive = true
  } else if (filters.status === "archived") {
    isActive = false
  }

  const name = filters.name?.trim()

  return {
    name: name && name.length > 0 ? name : undefined,
    isActive,
  }
}

type Step = "field" | "status" | "name"

export function TableFilter() {
  const { filters, setFilters } = useFilters()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("field")

  const [statusValue, setStatusValue] = useState<"active" | "archived">(
    "active"
  )
  const [name, setName] = useState(filters.name ?? "")

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setStep("field")
  }

  const removeStatus = () => {
    const next = { ...filters }
    delete next.status
    setFilters(next)
  }

  const removeName = () => {
    const next = { ...filters }
    delete next.name
    setFilters(next)
  }

  const applyStatus = () => {
    setFilters({ ...filters, status: statusValue })
    setOpen(false)
  }

  const applyName = () => {
    setFilters({ ...filters, name })
    setOpen(false)
  }

  const statusBadgeLabel = filters.status
    ? `Status is ${filters.status === "active" ? "Active" : "Archived"}`
    : null

  const nameBadgeLabel = filters.name ? `Name is ${filters.name}` : null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {statusBadgeLabel && (
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground"
          )}
        >
          <span className="truncate">{statusBadgeLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Remove status filter"
            onClick={removeStatus}
          >
            <IconX className="size-3.5" />
          </Button>
        </span>
      )}

      {nameBadgeLabel && (
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 text-sm text-foreground"
          )}
        >
          <span className="truncate">{nameBadgeLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Remove name filter"
            onClick={removeName}
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
                disabled={!!filters.status}
                onClick={() => {
                  setStatusValue("active")
                  setStep("status")
                }}
              >
                Status
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn("flex justify-start pl-2")}
                disabled={!!filters.name}
                onClick={() => {
                  setName("")
                  setStep("name")
                }}
              >
                Name
              </Button>
            </div>
          )}

          {step === "status" && (
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
                <p className="text-sm font-medium">Status</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Value</span>
                <Select
                  value={statusValue}
                  onValueChange={(value) =>
                    setStatusValue(value as "active" | "archived")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
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
                <Button type="button" size="sm" onClick={applyStatus}>
                  Apply filter
                </Button>
              </div>
            </div>
          )}

          {step === "name" && (
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
                <p className="text-sm font-medium">Name</p>
                <p className="text-xs text-muted-foreground">
                  Matches offerings whose name contains this text.
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Contains</span>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Search by name"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      applyName()
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
                <Button type="button" size="sm" onClick={applyName}>
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
