"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TableV1 } from "@/components/shared/table-v1"
import { mockCustomers } from "@/hooks/customers/mock-data"
import type { Customer } from "@/hooks/customers/types"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

type CustomersTableProps = {
  customers?: Customer[]
  onSelect?: (customer: Customer) => void
}

export function CustomersTable({
  customers = mockCustomers,
  onSelect = () => {},
}: CustomersTableProps) {
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const customer = row.original

          return (
            <button
              type="button"
              className="flex w-full items-center gap-3 text-left"
              onClick={() => onSelect(customer)}
            >
              <Avatar size="sm">
                {customer.avatarUrl ? (
                  <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                ) : null}
                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{customer.name}</p>
                <p className="truncate text-xs text-muted-foreground sm:hidden">
                  {customer.email}
                </p>
              </div>
            </button>
          )
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">{row.getValue("email")}</div>
        ),
        meta: {
          headerClassName: "hidden sm:table-cell",
          cellClassName: "hidden sm:table-cell",
        },
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (row.getValue("phone") as string | undefined) ?? "—",
        meta: {
          headerClassName: "hidden md:table-cell",
          cellClassName: "hidden md:table-cell",
        },
      },
      {
        accessorKey: "totalReservations",
        header: "Total Reservations",
        cell: ({ row }) => row.getValue("totalReservations"),
        meta: {
          headerClassName: "hidden lg:table-cell",
          cellClassName: "hidden lg:table-cell",
        },
      },
      {
        accessorKey: "lastReservation",
        header: "Last Reservation",
        cell: ({ row }) => {
          const customer = row.original

          return (
            <span className="text-muted-foreground">
              <span className="lg:hidden">
                {customer.totalReservations} bookings ·{" "}
              </span>
              {format(parseISO(customer.lastReservation), "MMM d, yyyy")}
            </span>
          )
        },
      },
    ],
    [onSelect]
  )

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border border-border bg-card">
        <TableV1 data={customers} columns={columns} />
      </div>
    </div>
  )
}
