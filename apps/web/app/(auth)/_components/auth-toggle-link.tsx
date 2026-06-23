"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function AuthToggleLink() {
  const pathname = usePathname()
  const isSignIn = pathname === "/sign-in"

  return (
    <p className="text-sm text-muted-foreground">
      {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
      <Link
        href={isSignIn ? "/sign-up" : "/sign-in"}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {isSignIn ? "Sign up" : "Sign in"}
      </Link>
    </p>
  )
}
