import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { getSession, Session } from "@/lib/auth-server"
import { getTRPCQueryUtils } from "@/lib/trpc/server"

const isExpired = (session: Session) => {
  if (session && session.session && session.session.expiresAt) {
    const now = new Date()
    const expiresAt = new Date(session.session.expiresAt)
    return now >= expiresAt
  }
  return false
}

type AuthGuardProps = {
  children: React.ReactNode
  requireOrganization?: boolean
}

export async function AuthGuard({
  children,
  requireOrganization = false,
}: AuthGuardProps) {
  const session = await getSession()

  if (!session || isExpired(session)) {
    redirect("/sign-in")
  }

  if (requireOrganization && !session.session.activeOrganizationId) {
    redirect("/onboarding")
  }

  const { trpc, queryClient } = await getTRPCQueryUtils()

  if (session.session.activeOrganizationId) {
    await trpc.auth.getOrganization.prefetch()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
