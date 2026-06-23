import type {
  ActivityItem,
  DashboardStats,
  RecentCustomer,
  UpcomingReservation,
} from "./types"

export const mockDashboardStats: DashboardStats = {
  businessName: "Sunset Pickleball Club",
  totalReservations: 1284,
  upcomingReservations: 24,
  activeOfferings: 12,
  totalCustomers: 356,
}

export const mockUpcomingReservations: UpcomingReservation[] = [
  {
    id: "res-001",
    customer: "Sarah Chen",
    offering: "Court A — Morning Session",
    date: "2026-06-20T09:00:00",
    status: "confirmed",
  },
  {
    id: "res-002",
    customer: "Marcus Johnson",
    offering: "Private Coaching",
    date: "2026-06-20T11:30:00",
    status: "pending",
  },
  {
    id: "res-003",
    customer: "Emily Rodriguez",
    offering: "Court B — Evening Session",
    date: "2026-06-21T18:00:00",
    status: "confirmed",
  },
  {
    id: "res-004",
    customer: "David Kim",
    offering: "Group Clinic — Beginners",
    date: "2026-06-22T10:00:00",
    status: "confirmed",
  },
  {
    id: "res-005",
    customer: "Lisa Thompson",
    offering: "Court A — Afternoon Session",
    date: "2026-06-22T14:00:00",
    status: "cancelled",
  },
]

export const mockRecentCustomers: RecentCustomer[] = [
  {
    id: "cust-001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
    lastReservation: "2026-06-19T09:00:00",
  },
  {
    id: "cust-002",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
    lastReservation: "2026-06-18T11:30:00",
  },
  {
    id: "cust-003",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily",
    lastReservation: "2026-06-17T18:00:00",
  },
  {
    id: "cust-004",
    name: "David Kim",
    email: "david.kim@email.com",
    lastReservation: "2026-06-16T10:00:00",
  },
  {
    id: "cust-005",
    name: "Lisa Thompson",
    email: "lisa.t@email.com",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa",
    lastReservation: "2026-06-15T14:00:00",
  },
]

export const mockRecentActivity: ActivityItem[] = [
  {
    id: "act-001",
    type: "reservation",
    message: "Sarah Chen booked Court A — Morning Session",
    timestamp: "2026-06-19T08:45:00",
  },
  {
    id: "act-002",
    type: "customer",
    message: "New customer James Wilson signed up",
    timestamp: "2026-06-19T07:30:00",
  },
  {
    id: "act-003",
    type: "cancellation",
    message: "Lisa Thompson cancelled Court A — Afternoon Session",
    timestamp: "2026-06-18T16:20:00",
  },
  {
    id: "act-004",
    type: "offering",
    message: "Group Clinic — Advanced added to offerings",
    timestamp: "2026-06-18T14:00:00",
  },
  {
    id: "act-005",
    type: "reservation",
    message: "Marcus Johnson booked Private Coaching",
    timestamp: "2026-06-18T11:15:00",
  },
  {
    id: "act-006",
    type: "reservation",
    message: "Emily Rodriguez booked Court B — Evening Session",
    timestamp: "2026-06-17T17:50:00",
  },
]
