import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

import { NavbarHeader } from "./navbar-header"
import { NavbarMobileMenu } from "./navbar-mobile-menu"

const navigationLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

const navLinkClassName = cn(
  navigationMenuTriggerStyle(),
  "relative transition-colors duration-200 after:absolute after:right-4 after:bottom-1 after:left-4 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:scale-x-100"
)

const buttonClassName =
  "transition-transform duration-150 ease-out hover:-translate-y-px active:scale-[0.98] motion-reduce:transform-none"

export function Navbar() {
  return (
    <NavbarHeader>
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
            R
          </div>
          <span className="text-lg font-semibold">Booking App</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  className={navLinkClassName}
                  render={<Link href={link.href}>{link.label}</Link>}
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center space-x-4 md:flex">
          <Button variant="ghost" className={buttonClassName}>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button className={buttonClassName}>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>

        <NavbarMobileMenu
          links={navigationLinks}
          buttonClassName={buttonClassName}
        />
      </div>
    </NavbarHeader>
  )
}
