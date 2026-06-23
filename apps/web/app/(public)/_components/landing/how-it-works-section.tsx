import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { MotionSection } from "./motion/motion-section"
import { StaggerContainer, StaggerItem } from "./motion/stagger"
import { FeatureCard } from "./motion/feature-card"

const steps = [
  {
    step: 1,
    title: "Create your offering",
    description:
      "Set up courts, services, sessions, or appointments. Define your availability and pricing structure.",
  },
  {
    step: 2,
    title: "Share your booking page",
    description:
      "Customers choose a time and submit a reservation. No account required for your customers.",
  },
  {
    step: 3,
    title: "Manage reservations",
    description:
      "Track bookings, customers, and availability from one dashboard. Send confirmations automatically.",
  },
]

export function HowItWorksSection() {
  return (
    <MotionSection
      id="how-it-works"
      className="relative border-t border-border/40 bg-muted/50 py-16 md:py-24 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/60 before:to-transparent"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center md:mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get started in minutes. No complicated setup or training required.
          </p>
        </div>

        <StaggerContainer className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {steps.map((item) => (
            <StaggerItem key={item.step}>
              <FeatureCard>
                <Card>
                  <CardHeader>
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
                    >
                      {item.step}
                    </div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
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
