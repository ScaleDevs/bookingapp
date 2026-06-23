"use client"

import { useMemo, useState } from "react"
import { isSameDay, parseISO } from "date-fns"
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCancelReservation } from "@/hooks/reservations/use-cancel-reservation"
import { useConfirmReservation } from "@/hooks/reservations/use-confirm-reservation"
import { useRescheduleReservation } from "@/hooks/reservations/use-reschedule-reservation"
import { useReservations } from "@/hooks/reservations/use-reservations"
import type { Reservation } from "@/hooks/reservations/types"
import type { ReservationsStatusFilter } from "@/app/dashboard/_components/shared/reservation-status"

import { ReservationDetailsDrawer } from "./reservation-details-drawer"
import { ReservationsEmptyState } from "./reservations-empty-state"
import { ReservationsHeader } from "./reservations-header"
import { ReservationsTable } from "./reservations-table"

function TableSkeleton() {
  return (
    <div className="space-y-3 px-4 lg:px-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function ReservationsContent() {
  const reservationsQuery = useReservations()
  const confirmReservation = useConfirmReservation()
  const cancelReservation = useCancelReservation()
  const rescheduleReservation = useRescheduleReservation()

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>()
  const [statusFilter, setStatusFilter] =
    useState<ReservationsStatusFilter>("all")
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredReservations = useMemo(() => {
    if (!reservationsQuery.data) return []

    const normalizedSearch = search.trim().toLowerCase()

    return reservationsQuery.data.filter((reservation) => {
      const matchesStatus =
        statusFilter === "all" || reservation.status === statusFilter

      const matchesDate =
        !dateFilter || isSameDay(parseISO(reservation.date), dateFilter)

      const matchesSearch =
        normalizedSearch.length === 0 ||
        reservation.reservationNumber
          .toLowerCase()
          .includes(normalizedSearch) ||
        reservation.customer.name.toLowerCase().includes(normalizedSearch) ||
        reservation.customer.email.toLowerCase().includes(normalizedSearch) ||
        reservation.offering.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesDate && matchesSearch
    })
  }, [reservationsQuery.data, search, dateFilter, statusFilter])

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setDrawerOpen(true)
  }

  const handleConfirm = (reservation: Reservation) => {
    // TODO: Connect useConfirmReservation mutation and refetch list
    confirmReservation.mutate({ id: reservation.id })
  }

  const handleCancel = (reservation: Reservation) => {
    // TODO: Connect useCancelReservation mutation and refetch list
    cancelReservation.mutate({ id: reservation.id })
  }

  const handleReschedule = (reservation: Reservation) => {
    // TODO: Connect useRescheduleReservation mutation with date picker dialog
    rescheduleReservation.mutate({
      id: reservation.id,
      date: reservation.date,
    })
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      setSelectedReservation(null)
    }
  }

  const showEmptyState =
    !reservationsQuery.isLoading &&
    !reservationsQuery.isError &&
    reservationsQuery.isEmpty

  const showFilteredEmpty =
    !reservationsQuery.isLoading &&
    !reservationsQuery.isError &&
    !reservationsQuery.isEmpty &&
    filteredReservations.length === 0

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ReservationsHeader
            search={search}
            onSearchChange={setSearch}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {reservationsQuery.isLoading ? (
            <TableSkeleton />
          ) : reservationsQuery.isError ? (
            <div className="px-4 lg:px-6">
              <Alert variant="destructive">
                <IconAlertCircle />
                <AlertTitle>Failed to load reservations</AlertTitle>
                <AlertDescription className="flex flex-col gap-3">
                  <span>
                    {reservationsQuery.error?.message ??
                      "Something went wrong. Please try again."}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={reservationsQuery.refetch}
                  >
                    <IconRefresh />
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : showEmptyState ? (
            <ReservationsEmptyState />
          ) : showFilteredEmpty ? (
            <div className="px-4 text-sm text-muted-foreground lg:px-6">
              No reservations match your search or filters.
            </div>
          ) : (
            <ReservationsTable
              reservations={filteredReservations}
              onView={handleView}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
            />
          )}
        </div>
      </div>

      <ReservationDetailsDrawer
        reservation={selectedReservation}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onReschedule={handleReschedule}
        isConfirming={confirmReservation.isPending}
        isCancelling={cancelReservation.isPending}
        isRescheduling={rescheduleReservation.isPending}
      />
    </div>
  )
}
