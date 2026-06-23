import { Fragment } from "react"
import { IconArrowRight, IconTrendingUp } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { MotionSection } from "./motion/motion-section"
import { StaggerContainer, StaggerItem } from "./motion/stagger"
import { DashboardCard } from "./motion/dashboard-card"

const timelineSteps = [
  {
    step: 1,
    title: "Owner creates courts",
    description:
      "Set up Court A, Court B, and Court C with hourly booking slots from 8 AM to 8 PM.",
  },
  {
    step: 2,
    title: "Players reserve a slot",
    description:
      "Sarah visits the booking page, selects Court A at 2:00 PM, and submits her reservation.",
  },
  {
    step: 3,
    title: "Reservation is confirmed",
    description:
      "Sarah receives a confirmation and the slot is marked as unavailable for others.",
  },
  {
    step: 4,
    title: "Staff manages bookings",
    description:
      "View all reservations in the dashboard, check in players, and update booking status.",
  },
  {
    step: 5,
    title: "Court usage is tracked",
    description:
      "Analytics show peak hours, most popular courts, and revenue trends.",
  },
]

const courtAvailability = [
  { name: "Court A", color: "bg-green-500", slots: "3 slots available" },
  { name: "Court B", color: "bg-yellow-500", slots: "1 slot available" },
  { name: "Court C", color: "bg-green-500", slots: "5 slots available" },
]

export function PickleballExampleSection() {
  return (
    <MotionSection
      className="relative border-t border-border/40 bg-muted/50 py-16 md:py-24 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/60 before:to-transparent"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center md:mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            See how a pickleball court operates with the platform
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From setup to booking to management, everything flows seamlessly.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            <StaggerContainer className="grid gap-6">
              {timelineSteps.map((item, index) => (
                <Fragment key={item.step}>
                  <StaggerItem>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                          >
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-2 text-lg font-semibold">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                  {index < timelineSteps.length - 1 && (
                    <div className="flex justify-center">
                      <IconArrowRight
                        className="h-6 w-6 rotate-90 text-muted-foreground"
                      />
                    </div>
                  )}
                </Fragment>
              ))}
            </StaggerContainer>

            <DashboardCard>
              <Card className="mt-8 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <IconTrendingUp className="h-5 w-5" />
                    <span>Today&apos;s Court Availability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courtAvailability.map((court) => (
                      <div
                        key={court.name}
                        className="flex items-center justify-between rounded-lg bg-muted p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-3 w-3 rounded-full ${court.color}`}
                          />
                          <span className="font-medium">{court.name}</span>
                        </div>
                        <Badge variant="outline">{court.slots}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </DashboardCard>
          </div>
        </div>
      </div>
    </MotionSection>
  )
}
