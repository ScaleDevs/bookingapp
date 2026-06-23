import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

import { MotionSection } from "./motion/motion-section"
import { StaggerContainer, StaggerItem } from "./motion/stagger"

const buttonClassName =
  "transition-transform duration-150 ease-out hover:-translate-y-px active:scale-[0.98] motion-reduce:transform-none"

export function FinalCtaSection() {
  return (
    <MotionSection
      className="relative border-t border-border/40 bg-muted/50 py-16 md:py-24 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/60 before:to-transparent"
    >
      <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Start accepting reservations today.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Launch your booking page in minutes and manage reservations from a
            single dashboard.
          </p>
          <StaggerContainer
            className="flex flex-col justify-center gap-4 pt-4 sm:flex-row"
          >
            <StaggerItem>
              <Button size="lg" className={buttonClassName}>
                <Link href="/auth/sign-up" className="flex items-center">
                  Get Started Free
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </StaggerItem>
            <StaggerItem>
              <Button size="lg" variant="outline" className={buttonClassName}>
                Contact Sales
              </Button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </MotionSection>
  )
}
