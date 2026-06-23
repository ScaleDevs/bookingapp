"use client"

import { useReducedMotion } from "motion/react"

export function useMotionReduced() {
  const shouldReduceMotion = useReducedMotion() ?? false

  return {
    shouldReduceMotion,
    initial: shouldReduceMotion ? "visible" : "hidden",
    instant: { duration: 0 },
  }
}
