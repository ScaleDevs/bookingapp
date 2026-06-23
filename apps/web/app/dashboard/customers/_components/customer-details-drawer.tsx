"use client"

import { format, parseISO } from "date-fns"
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconMail,
  IconPhone,
  IconRefresh,
} from "@tabler/icons-react"

import {
  statusLabels,
  statusVariant,
} from "@/app/dashboard/_components/shared/reservation-status"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { CustomerDetails } from "@/hooks/customers/types"
import type { ReservationStatus } from "@/hooks/reservations/types"
import { useIsMobile } from "@/hooks/use-mobile"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

type CustomerDetailsDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  details: CustomerDetails | null
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Separator />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

function formatHistoryStatus(status: string) {
  const normalized = status as ReservationStatus
  return statusLabels[normalized] ?? status
}

function getHistoryStatusVariant(status: string) {
  const normalized = status as ReservationStatus
  return statusVariant[normalized] ?? "outline"
}

export function CustomerDetailsDrawer({
  open,
  onOpenChange,
  details,
  isLoading,
  isError,
  error,
  onRetry,
}: CustomerDetailsDrawerProps) {
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
              <DrawerTitle>Customer details</DrawerTitle>
            </DrawerHeader>
            <DrawerSkeleton />
          </>
        ) : isError ? (
          <>
            <DrawerHeader>
              <DrawerTitle>Customer details</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <Alert variant="destructive">
                <IconAlertCircle />
                <AlertTitle>Failed to load customer</AlertTitle>
                <AlertDescription className="flex flex-col gap-3">
                  <span>
                    {error?.message ??
                      "Something went wrong. Please try again."}
                  </span>
                  {onRetry ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={onRetry}
                    >
                      <IconRefresh />
                      Try again
                    </Button>
                  ) : null}
                </AlertDescription>
              </Alert>
            </div>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : details ? (
          <>
            <DrawerHeader className="gap-2">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  {details.profile.avatarUrl ? (
                    <AvatarImage
                      src={details.profile.avatarUrl}
                      alt={details.profile.name}
                    />
                  ) : null}
                  <AvatarFallback>
                    {getInitials(details.profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <DrawerTitle>{details.profile.name}</DrawerTitle>
                  <DrawerDescription>
                    Customer since{" "}
                    {format(parseISO(details.profile.joinedAt), "MMMM yyyy")}
                  </DrawerDescription>
                </div>
              </div>
            </DrawerHeader>

            <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-4">
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">Profile</h3>
                <div className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconMail className="size-4 shrink-0" />
                    <span>{details.profile.email}</span>
                  </div>
                  {details.profile.phone ? (
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <IconPhone className="size-4 shrink-0" />
                      <span>{details.profile.phone}</span>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">Reservation history</h3>
                {details.reservationHistory.length === 0 ? (
                  <Empty className="border py-8">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <IconCalendarEvent />
                      </EmptyMedia>
                      <EmptyTitle>No reservations</EmptyTitle>
                      <EmptyDescription>
                        This customer has not booked any sessions yet.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {details.reservationHistory.map((reservation) => (
                      <li
                        key={reservation.id}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium">{reservation.offering}</p>
                          <Badge
                            variant={getHistoryStatusVariant(
                              reservation.status
                            )}
                          >
                            {formatHistoryStatus(reservation.status)}
                          </Badge>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          {format(
                            parseISO(reservation.date),
                            "MMM d, yyyy · h:mm a"
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium">Notes</h3>
                {details.notes.length === 0 ? (
                  <Empty className="border py-8">
                    <EmptyHeader>
                      <EmptyTitle>No notes</EmptyTitle>
                      <EmptyDescription>
                        Staff notes about this customer will appear here.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {details.notes.map((note, index) => (
                      <li
                        key={index}
                        className="rounded-lg border p-3 text-sm text-muted-foreground"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
