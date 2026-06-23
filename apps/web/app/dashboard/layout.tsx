import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { AppSidebar } from "@/app/dashboard/_components/layout/app-sidebar"
import { SiteHeader } from "@/app/dashboard/_components/layout/site-header"
import { AuthGuard } from "@/components/shared/auth-guard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireOrganization>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
