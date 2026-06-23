import {
  IconCalendar,
  IconUsers,
  IconEdit,
  IconChartBar,
  IconBell,
  IconShield,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { MotionSection } from "./motion/motion-section"
import { StaggerContainer, StaggerItem } from "./motion/stagger"
import { FeatureCard } from "./motion/feature-card"

const features = [
  {
    icon: IconEdit,
    title: "Offerings",
    description:
      "Create and manage multiple bookable services, courts, or appointments with custom durations and pricing.",
  },
  {
    icon: IconCalendar,
    title: "Reservations",
    description:
      "Track all incoming reservations with status updates, customer details, and booking history.",
  },
  {
    icon: IconUsers,
    title: "Customer Management",
    description:
      "Store and manage customer information, view booking history, and build relationships.",
  },
  {
    icon: IconShield,
    title: "Availability Controls",
    description:
      "Set operating hours, block off time, and prevent overbooking with smart availability management.",
  },
  {
    icon: IconBell,
    title: "Notifications",
    description:
      "Send automated confirmations and reminders to reduce no-shows and keep customers informed.",
  },
  {
    icon: IconChartBar,
    title: "Analytics",
    description:
      "Monitor booking activity, track revenue, and gain insights into your busiest times and top customers.",
  },
]

export function FeaturesSection() {
  return (
    <MotionSection id="features" className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center md:mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Everything you need to manage reservations
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Powerful features designed for reservation-based businesses of all
            sizes.
          </p>
        </div>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <FeatureCard>
                <Card>
                  <CardHeader>
                    <feature.icon className="mb-4 h-10 w-10 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </FeatureCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </MotionSection>
  )
}
