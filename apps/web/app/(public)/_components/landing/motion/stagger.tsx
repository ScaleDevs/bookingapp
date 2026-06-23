"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { staggerContainer, staggerItem } from "@/lib/motion/variants"
import { viewport } from "@/lib/motion/transitions"

import { useMotionReduced } from "./use-motion-reduced"

type StaggerContainerProps = {
  children: ReactNode
  className?: string
  /** Animate on mount instead of when entering the viewport */
  mount?: boolean
  delay?: number
}

export function StaggerContainer({
  children,
  className,
  mount = false,
  delay = 0,
}: StaggerContainerProps) {
  const { shouldReduceMotion, initial, instant } = useMotionReduced()

  const motionProps = mount
    ? {
        initial,
        animate: "visible" as const,
        transition: shouldReduceMotion ? instant : { delay },
      }
    : {
        initial,
        whileInView: "visible" as const,
        viewport,
        transition: shouldReduceMotion ? instant : undefined,
      }

  return (
    <motion.div className={className} variants={staggerContainer} {...motionProps}>
      {children}
    </motion.div>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const { shouldReduceMotion, instant } = useMotionReduced()

  return (
    <motion.div
      className={className}
      variants={staggerItem}
      transition={shouldReduceMotion ? instant : undefined}
    >
      {children}
    </motion.div>
  )
}
