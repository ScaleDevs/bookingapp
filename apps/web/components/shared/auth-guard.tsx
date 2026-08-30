import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { getSession, Session } from "@/lib/auth-server"
import { getORPCQueryUtils } from "@/lib/orpc/server"

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

  const { orpc, queryClient } = await getORPCQueryUtils()

  if (session.session.activeOrganizationId) {
    await queryClient.prefetchQuery(
      orpc.auth.getOrganization.queryOptions({ input: {} })
    )
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
