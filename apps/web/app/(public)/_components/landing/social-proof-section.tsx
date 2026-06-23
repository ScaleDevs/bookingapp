import { Badge } from "@/components/ui/badge"

import { MotionSection } from "./motion/motion-section"
import { StaggerContainer, StaggerItem } from "./motion/stagger"

const industries = [
  "Pickleball Courts",
  "Fitness Studios",
  "Tutors",
  "Consultants",
  "Clinics",
  "Event Spaces",
]

export function SocialProofSection() {
  return (
    <MotionSection
      className="relative border-t border-border/40 bg-muted/50 py-16 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/60 before:to-transparent"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Trusted by businesses that depend on reservations.
          </h2>
        </div>
        <StaggerContainer className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {industries.map((industry) => (
            <StaggerItem key={industry}>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {industry}
              </Badge>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </MotionSection>
  )
}
