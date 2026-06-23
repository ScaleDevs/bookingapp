"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import type { Variants } from "motion/react"

import { transitions } from "@/lib/motion/transitions"

import { useMotionReduced } from "./use-motion-reduced"

type MountRevealProps = {
  children: ReactNode
  className?: string
  variants: Variants
  delay?: number
  duration?: number
}

export function MountReveal({
  children,
  className,
  variants,
  delay = 0,
  duration = 0.6,
}: MountRevealProps) {
  const { shouldReduceMotion, initial, instant } = useMotionReduced()

  return (
    <motion.div
      className={className}
      initial={initial}
      animate="visible"
      variants={variants}
      transition={
        shouldReduceMotion
          ? instant
          : { duration, delay, ease: transitions.medium.ease }
      }
    >
      {children}
    </motion.div>
  )
}
