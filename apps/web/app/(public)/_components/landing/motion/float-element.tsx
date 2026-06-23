"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { transitions } from "@/lib/motion/transitions"

import { useMotionReduced } from "./use-motion-reduced"

type FloatElementProps = {
  children: ReactNode
  className?: string
}

export function FloatElement({ children, className }: FloatElementProps) {
  const { shouldReduceMotion } = useMotionReduced()

  return (
    <motion.div
      className={className}
      animate={
        shouldReduceMotion
          ? undefined
          : { y: [0, -4, 0], transition: transitions.float }
      }
    >
      {children}
    </motion.div>
  )
}
