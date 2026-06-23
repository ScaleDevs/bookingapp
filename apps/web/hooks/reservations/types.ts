export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"

export type ReservationTimelineEvent = {
  id: string
  label: string
  timestamp: string
  description?: string
}

export type ReservationCustomer = {
  id: string
  name: string
  email: string
  phone?: string
}

export type Reservation = {
  id: string
  reservationNumber: string
  customer: ReservationCustomer
  offering: string
  offeringId: string
  date: string
  duration: number
  status: ReservationStatus
  notes?: string
  timeline: ReservationTimelineEvent[]
}

export type ConfirmReservationInput = {
  id: string
}

export type CancelReservationInput = {
  id: string
}

export type RescheduleReservationInput = {
  id: string
  date: string
}

export type ReservationsQueryState = {
  data: Reservation[] | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}
