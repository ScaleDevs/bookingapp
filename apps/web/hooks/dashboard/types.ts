export type ReservationStatus = "confirmed" | "pending" | "cancelled"

export type DashboardStats = {
  businessName: string
  totalReservations: number
  upcomingReservations: number
  activeOfferings: number
  totalCustomers: number
}

export type UpcomingReservation = {
  id: string
  customer: string
  offering: string
  date: string
  status: ReservationStatus
}

export type RecentCustomer = {
  id: string
  name: string
  email: string
  avatarUrl?: string
  lastReservation: string
}

export type ActivityItem = {
  id: string
  type: "reservation" | "cancellation" | "customer" | "offering"
  message: string
  timestamp: string
}

export type QueryState<T> = {
  data: T | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}
