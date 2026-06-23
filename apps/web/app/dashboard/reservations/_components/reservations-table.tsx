"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import {
  IconCalendarEvent,
  IconCheck,
  IconDotsVertical,
  IconEye,
  IconX,
} from "@tabler/icons-react"

import {
  statusLabels,
  statusVariant,
} from "@/app/dashboard/_components/shared/reservation-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableV1 } from "@/components/shared/table-v1"
import { mockReservations } from "@/hooks/reservations/mock-data"
import type { Reservation, ReservationStatus } from "@/hooks/reservations/types"

type ReservationsTableProps = {
  reservations?: Reservation[]
  onView?: (reservation: Reservation) => void
  onConfirm?: (reservation: Reservation) => void
  onCancel?: (reservation: Reservation) => void
  onReschedule?: (reservation: Reservation) => void
}

function canConfirm(status: ReservationStatus) {
  return status === "pending"
}

function canCancel(status: ReservationStatus) {
  return status === "pending" || status === "confirmed"
}

function canReschedule(status: ReservationStatus) {
  return status === "pending" || status === "confirmed"
}

export function ReservationsTable({
  reservations = mockReservations,
  onView = () => {},
  onConfirm = () => {},
  onCancel = () => {},
  onReschedule = () => {},
}: ReservationsTableProps) {
  const columns = useMemo<ColumnDef<Reservation>[]>(
    () => [
      {
        accessorKey: "reservationNumber",
        header: "Reservation Number",
        cell: ({ row }) => (
          <span className="font-mono text-xs">
            {row.getValue("reservationNumber")}
          </span>
        ),
        meta: {
          headerClassName: "hidden sm:table-cell",
          cellClassName: "hidden sm:table-cell",
        },
      },
      {
        id: "customer",
        accessorFn: (row) => row.customer.name,
        header: "Customer",
        cell: ({ row }) => {
          const reservation = row.original

          return (
            <div className="font-medium">
              <div>{reservation.customer.name}</div>
              <div className="text-xs text-muted-foreground sm:hidden">
                {reservation.reservationNumber}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "offering",
        header: "Offering",
        cell: ({ row }) => (
          <div className="max-w-[180px] truncate">
            {row.getValue("offering")}
          </div>
        ),
        meta: {
          headerClassName: "hidden md:table-cell",
          cellClassName: "hidden md:table-cell",
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          const parsedDate = parseISO(row.getValue("date") as string)

          return (
            <span className="text-muted-foreground">
              {format(parsedDate, "MMM d, yyyy")}
            </span>
          )
        },
        meta: {
          headerClassName: "hidden lg:table-cell",
          cellClassName: "hidden lg:table-cell",
        },
      },
      {
        id: "time",
        accessorKey: "date",
        header: "Time",
        cell: ({ row }) => {
          const parsedDate = parseISO(row.getValue("date") as string)

          return (
            <span className="text-muted-foreground">
              <span className="lg:hidden">
                {format(parsedDate, "MMM d")} ·{" "}
              </span>
              {format(parsedDate, "h:mm a")}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as ReservationStatus

          return (
            <Badge variant={statusVariant[status]}>
              {statusLabels[status]}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const reservation = row.original

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon-sm">
                      <IconDotsVertical />
                      <span className="sr-only">Open actions</span>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(reservation)}>
                    <IconEye />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!canConfirm(reservation.status)}
                    onClick={() => onConfirm(reservation)}
                  >
                    <IconCheck />
                    Confirm
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!canReschedule(reservation.status)}
                    onClick={() => onReschedule(reservation)}
                  >
                    <IconCalendarEvent />
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={!canCancel(reservation.status)}
                    onClick={() => onCancel(reservation)}
                  >
                    <IconX />
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
        enableSorting: false,
        enableHiding: false,
        size: 70,
        meta: {
          headerClassName: "w-[70px] text-right",
          cellClassName: "text-right",
        },
      },
    ],
    [onView, onConfirm, onCancel, onReschedule]
  )

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border border-border bg-card">
        <TableV1 data={reservations} columns={columns} />
      </div>
    </div>
  )
}
