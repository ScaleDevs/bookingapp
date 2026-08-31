"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import {
  IconCalendarEvent,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconSettings,
  IconUsers,
  IconHelp,
  IconSearch,
  IconClock,
} from "@tabler/icons-react"

import { NavBookingManagement } from "@/app/dashboard/_components/layout/nav-booking-management"
import { NavMain } from "@/app/dashboard/_components/layout/nav-main"
import { NavSecondary } from "@/app/dashboard/_components/layout/nav-secondary"
import { NavUser } from "@/app/dashboard/_components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { orpc } from "@/lib/orpc/client"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <IconDashboard />,
    },
    {
      title: "Offerings",
      url: "/dashboard/offerings",
      icon: <IconListDetails />,
    },
  ],

  bookingManagement: [
    {
      title: "Blocked Schedules",
      url: "/dashboard/blocked-schedules",
      icon: <IconClock />,
    },
    {
      title: "Reservations",
      url: "/dashboard/reservations",
      icon: <IconCalendarEvent />,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: <IconUsers />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <IconSettings />,
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: <IconHelp />,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: <IconSearch />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: organization } = useQuery(
    orpc.organizations.get.queryOptions({ input: {} })
  )

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" />}
            >
              <IconInnerShadowTop className="size-5!" />
              <span className="text-base font-semibold">
                {organization?.name || "Loading..."}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavBookingManagement items={data.bookingManagement} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
