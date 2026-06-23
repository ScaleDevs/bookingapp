import { IconCircleCheck, IconCircleX } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { MotionSection } from "./motion/motion-section"
import { StaggerContainer, StaggerItem } from "./motion/stagger"

const problems = [
  {
    title: "Taking bookings through messages",
    description: "Lost in endless text threads and email chains",
  },
  {
    title: "Manual scheduling",
    description: "Wasting time coordinating availability",
  },
  {
    title: "Double bookings",
    description: "Conflicts and disappointed customers",
  },
  {
    title: "Lost customer information",
    description: "No central place to track customer data",
  },
]

const solutions = [
  {
    title: "Centralized reservations",
    description: "All bookings in one organized dashboard",
  },
  {
    title: "Customer management",
    description: "Store and track customer information automatically",
  },
  {
    title: "Availability controls",
    description: "Prevent double bookings automatically",
  },
  {
    title: "Reservation tracking",
    description: "See all past, present, and upcoming bookings",
  },
]

export function ProblemSolutionSection() {
  return (
    <MotionSection className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="destructive" className="w-fit">
                Common Problems
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Managing reservations shouldn&apos;t be this hard.
              </h2>
            </div>
            <StaggerContainer className="space-y-4">
              {problems.map((problem) => (
                <StaggerItem key={problem.title}>
                  <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <IconCircleX
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive"
                        />
                        <div>
                          <h3 className="mb-1 font-semibold">
                            {problem.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {problem.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Badge className="w-fit">Our Solution</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Everything you need in one platform.
              </h2>
            </div>
            <StaggerContainer className="space-y-4">
              {solutions.map((solution) => (
                <StaggerItem key={solution.title}>
                  <Card className="border-primary/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <IconCircleCheck
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                        />
                        <div>
                          <h3 className="mb-1 font-semibold">
                            {solution.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {solution.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </MotionSection>
  )
}
