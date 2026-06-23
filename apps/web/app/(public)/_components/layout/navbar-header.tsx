"use client"

import { motion } from "motion/react"

import { navbarEntrance } from "@/lib/motion/variants"
import { transitions } from "@/lib/motion/transitions"

import { useMotionReduced } from "../landing/motion/use-motion-reduced"

export function NavbarHeader({ children }: { children: React.ReactNode }) {
  const { shouldReduceMotion, initial, instant } = useMotionReduced()

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={initial}
      animate="visible"
      variants={navbarEntrance}
      transition={shouldReduceMotion ? instant : transitions.fast}
    >
      {children}
    </motion.header>
  )
}
