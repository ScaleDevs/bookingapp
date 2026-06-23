"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/offerings": "Offerings",
  "/dashboard/reservations": "Reservations",
  "/dashboard/customers": "Customers",
  "/dashboard/schedules": "Schedules",
  "/dashboard/settings": "Settings",
}

function getPageTitle(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/"

  if (pageTitles[path]) {
    return pageTitles[path]
  }

  const match = Object.entries(pageTitles)
    .filter(([href]) => href !== "/dashboard")
    .find(([href]) => path.startsWith(href))

  return match?.[1] ?? "Dashboard"
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
