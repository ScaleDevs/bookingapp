"use client"

import { format, parseISO } from "date-fns"
import {
  IconCalendarEvent,
  IconCheck,
  IconMail,
  IconPhone,
  IconUser,
  IconX,
} from "@tabler/icons-react"

import {
  statusLabels,
  statusVariant,
} from "@/app/dashboard/_components/shared/reservation-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { Reservation, ReservationStatus } from "@/hooks/reservations/types"
import { useIsMobile } from "@/hooks/use-mobile"

type ReservationDetailsDrawerProps = {
  reservation: Reservation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onConfirm: (reservation: Reservation) => void
  onCancel: (reservation: Reservation) => void
  onReschedule: (reservation: Reservation) => void
  isConfirming?: boolean
  isCancelling?: boolean
  isRescheduling?: boolean
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

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Separator />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export function ReservationDetailsDrawer({
  reservation,
  open,
  onOpenChange,
  isLoading,
  onConfirm,
  onCancel,
  onReschedule,
  isConfirming,
  isCancelling,
  isRescheduling,
}: ReservationDetailsDrawerProps) {
  const isMobile = useIsMobile()

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="sm:max-w-md">
        {isLoading ? (
          <>
            <DrawerHeader>
              <DrawerTitle>Reservation details</DrawerTitle>
            </DrawerHeader>
            <DrawerSkeleton />
          </>
        ) : reservation ? (
          <>
            <DrawerHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <DrawerTitle>{reservation.reservationNumber}</DrawerTitle>
                  <DrawerDescription>{reservation.offering}</DrawerDescription>
                </div>
                <Badge variant={statusVariant[reservation.status]}>
                  {statusLabels[reservation.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(reservation.date), "EEEE, MMMM d, yyyy")} at{" "}
                {format(parseISO(reservation.date), "h:mm a")}
              </p>
            </DrawerHeader>

            <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-4">
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">Customer details</h3>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <IconUser className="size-4 text-muted-foreground" />
                    <span className="font-medium">
                      {reservation.customer.name}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <IconMail className="size-4 shrink-0" />
                    <span>{reservation.customer.email}</span>
                  </div>
                  {reservation.customer.phone ? (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <IconPhone className="size-4 shrink-0" />
                      <span>{reservation.customer.phone}</span>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">Offering</h3>
                <div className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{reservation.offering}</p>
                  <p className="mt-1 text-muted-foreground">
                    Duration: {reservation.duration} minutes
                  </p>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">Notes</h3>
                <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                  {reservation.notes ?? "No notes for this reservation."}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">Reservation timeline</h3>
                <ol className="flex flex-col gap-0">
                  {reservation.timeline.map((event, index) => (
                    <li key={event.id} className="relative flex gap-3 pb-6">
                      {index < reservation.timeline.length - 1 ? (
                        <span
                          className="absolute top-2 left-[5px] h-full w-px bg-border"
                          aria-hidden
                        />
                      ) : null}
                      <span
                        className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            parseISO(event.timestamp),
                            "MMM d, yyyy · h:mm a"
                          )}
                        </p>
                        {event.description ? (
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <DrawerFooter className="flex-col gap-2 sm:flex-row">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Close
                </Button>
              </DrawerClose>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                disabled={!canReschedule(reservation.status) || isRescheduling}
                onClick={() => onReschedule(reservation)}
              >
                <IconCalendarEvent />
                Reschedule
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={!canConfirm(reservation.status) || isConfirming}
                onClick={() => onConfirm(reservation)}
              >
                <IconCheck />
                Confirm
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={!canCancel(reservation.status) || isCancelling}
                onClick={() => onCancel(reservation)}
              >
                <IconX />
                Cancel
              </Button>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
