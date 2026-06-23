"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { useMotionReduced } from "./use-motion-reduced"

type FeatureCardProps = {
  children: ReactNode
  className?: string
}

export function FeatureCard({ children, className }: FeatureCardProps) {
  const { shouldReduceMotion } = useMotionReduced()

  return (
    <motion.div
      className={cn("group/feature-card", className)}
      whileHover={
        shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }
      }
    >
      <div className="transition-shadow duration-200 group-hover/feature-card:shadow-md">
        {children}
      </div>
    </motion.div>
  )
}
