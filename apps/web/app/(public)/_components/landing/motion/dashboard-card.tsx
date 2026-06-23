"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { useMotionReduced } from "./use-motion-reduced"

type DashboardCardProps = {
  children: ReactNode
  className?: string
}

export function DashboardCard({ children, className }: DashboardCardProps) {
  const { shouldReduceMotion } = useMotionReduced()

  return (
    <motion.div
      className={className}
      whileHover={
        shouldReduceMotion ? undefined : { y: -2, transition: { duration: 0.2 } }
      }
    >
      {children}
    </motion.div>
  )
}
