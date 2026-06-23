"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "motion/react"
import { IconMenu } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { transitions } from "@/lib/motion/transitions"
import { cn } from "@/lib/utils"

import { useMotionReduced } from "../landing/motion/use-motion-reduced"

type NavigationLink = {
  href: string
  label: string
}

type NavbarMobileMenuProps = {
  links: NavigationLink[]
  buttonClassName: string
}

export function NavbarMobileMenu({
  links,
  buttonClassName,
}: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false)
  const { shouldReduceMotion, instant } = useMotionReduced()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="md:hidden"
        render={
          <Button variant="ghost" size="icon">
            <IconMenu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 grid h-full grid-rows-[auto_1fr_auto] gap-6 px-5 pb-5">
          <div className="flex flex-col space-y-4">
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 10 }}
                animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={
                  shouldReduceMotion
                    ? instant
                    : {
                        delay: open ? index * 0.05 : 0,
                        duration: 0.3,
                        ease: transitions.fast.ease,
                      }
                }
              >
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium transition-colors duration-200 hover:text-primary"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="flex-1" />
          <div className="space-y-2 border-t pt-4">
            <Button
              variant="outline"
              className={cn("w-full", buttonClassName)}
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button className={cn("w-full", buttonClassName)}>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
