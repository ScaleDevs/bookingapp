import { IconCalendar } from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fadeInUpLarge } from "@/lib/motion/variants"
import { transitions } from "@/lib/motion/transitions"

import { MountReveal } from "./mount-reveal"
import { FloatElement } from "./float-element"
import { DashboardCard } from "./dashboard-card"

export function HeroDashboardPreview() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-primary/8 blur-3xl"
        aria-hidden="true"
      />
      <MountReveal
        variants={fadeInUpLarge}
        duration={transitions.medium.duration}
        delay={0.3}
      >
        <FloatElement>
          <div className="grid gap-4">
            <DashboardCard>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Upcoming Reservations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div className="flex items-center space-x-3">
                      <IconCalendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Court A - 2:00 PM</p>
                        <p className="text-xs text-muted-foreground">
                          Sarah Johnson
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Today</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div className="flex items-center space-x-3">
                      <IconCalendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Court B - 4:00 PM</p>
                        <p className="text-xs text-muted-foreground">
                          Mike Davis
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Today</Badge>
                  </div>
                </CardContent>
              </Card>
            </DashboardCard>

            <div className="grid grid-cols-2 gap-4">
              <DashboardCard>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-2">
                      <p className="text-2xl font-bold">47</p>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                  </CardContent>
                </Card>
              </DashboardCard>
              <DashboardCard>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-2">
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">
                        Available Courts
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </DashboardCard>
            </div>
          </div>
        </FloatElement>
      </MountReveal>
    </div>
  )
}
