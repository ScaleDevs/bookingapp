import Link from "next/link"
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fadeInUp, fadeInUpSmall } from "@/lib/motion/variants"
import { transitions } from "@/lib/motion/transitions"

import { MountReveal } from "./mount-reveal"
import { StaggerContainer, StaggerItem } from "./stagger"

const buttonClassName =
  "transition-transform duration-150 ease-out hover:-translate-y-px active:scale-[0.98] motion-reduce:transform-none"

export function HeroContent() {
  return (
    <div className="flex flex-col space-y-8">
      <MountReveal
        variants={fadeInUpSmall}
        duration={transitions.fast.duration}
      >
        <Badge
          variant="secondary"
          className="w-fit px-3 py-1 text-xs sm:text-sm"
        >
          Built for reservation-based businesses
        </Badge>
      </MountReveal>

      <MountReveal variants={fadeInUp} duration={transitions.medium.duration}>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Accept reservations online without the back-and-forth.
          </h1>
        </div>
      </MountReveal>

      <MountReveal
        variants={fadeInUp}
        duration={transitions.medium.duration}
        delay={0.1}
      >
        <p className="text-lg text-muted-foreground sm:text-xl">
          Create offerings, publish your booking page, manage customers, and
          track reservations from one place.
        </p>
      </MountReveal>

      <StaggerContainer
        mount
        delay={0.2}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <StaggerItem>
          <Button size="lg" className={buttonClassName}>
            <Link href="/auth/sign-up" className="flex items-center">
              <span>Get Started Free</span>
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </StaggerItem>
        <StaggerItem>
          <Button size="lg" variant="outline" className={buttonClassName}>
            <IconPlayerPlay className="mr-2 h-4 w-4" />
            View Demo
          </Button>
        </StaggerItem>
      </StaggerContainer>
    </div>
  )
}
