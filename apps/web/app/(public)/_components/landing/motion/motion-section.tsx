"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { fadeInUpSection } from "@/lib/motion/variants"
import { transitions, viewport } from "@/lib/motion/transitions"

import { useMotionReduced } from "./use-motion-reduced"

type MotionSectionProps = {
  children: ReactNode
  className?: string
  id?: string
}

export function MotionSection({ children, className, id }: MotionSectionProps) {
  const { shouldReduceMotion, initial, instant } = useMotionReduced()

  return (
    <motion.section
      id={id}
      className={className}
      initial={initial}
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUpSection}
      transition={shouldReduceMotion ? instant : transitions.medium}
    >
      {children}
    </motion.section>
  )
}
