"use client"

import { format } from "date-fns"
import {
  IconCalendar,
  IconFilter,
  IconSearch,
  IconX,
} from "@tabler/icons-react"

import {
  statusFilterOptions,
  type ReservationsStatusFilter,
} from "@/app/dashboard/_components/shared/reservation-status"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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

type ReservationsHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
  dateFilter?: Date
  onDateFilterChange: (date?: Date) => void
  statusFilter: ReservationsStatusFilter
  onStatusFilterChange: (value: ReservationsStatusFilter) => void
}

export function ReservationsHeader({
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
}: ReservationsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Reservations</h2>
        <p className="text-sm text-muted-foreground">
          View and manage customer bookings across all offerings.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <InputGroup className="lg:max-w-xs">
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search reservations..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </InputGroup>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full justify-start sm:w-[200px]"
                />
              }
            >
              <IconCalendar className="size-4 text-muted-foreground" />
              {dateFilter ? format(dateFilter, "PPP") : "All dates"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={onDateFilterChange}
              />
              {dateFilter ? (
                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => onDateFilterChange(undefined)}
                  >
                    <IconX />
                    Clear date filter
                  </Button>
                </div>
              ) : null}
            </PopoverContent>
          </Popover>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as ReservationsStatusFilter)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <IconFilter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
