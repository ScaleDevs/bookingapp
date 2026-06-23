export type Customer = {
  id: string
  name: string
  email: string
  phone?: string
  totalReservations: number
  lastReservation: string
  avatarUrl?: string
}

export type CustomerReservationHistoryItem = {
  id: string
  offering: string
  date: string
  status: string
}

export type CustomerProfile = {
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  joinedAt: string
}

export type CustomerDetails = {
  id: string
  profile: CustomerProfile
  reservationHistory: CustomerReservationHistoryItem[]
  notes: string[]
}

export type CustomersQueryState = {
  data: Customer[] | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}

export type CustomerDetailsQueryState = {
  data: CustomerDetails | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}
