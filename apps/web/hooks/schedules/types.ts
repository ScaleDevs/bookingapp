export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

export type BusinessHoursDay = {
  day: DayOfWeek
  openTime: string
  closeTime: string
}

export type AvailabilityRules = {
  bookingWindowDays: number
  minimumNoticeHours: number
  maximumAdvanceBookingDays: number
}

export type ScheduleData = {
  businessHours: BusinessHoursDay[]
  availabilityRules: AvailabilityRules
}

export type BlackoutDate = {
  id: string
  date: string
  reason: string
}

export type UpdateBusinessHoursInput = {
  businessHours: BusinessHoursDay[]
}

export type CreateBlackoutDateInput = {
  date: string
  reason: string
}

export type UpdateBlackoutDateInput = {
  id: string
  date: string
  reason: string
}

export type DeleteBlackoutDateInput = {
  id: string
}

export type SchedulesQueryState = {
  data: ScheduleData | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}

export type BlackoutDatesQueryState = {
  data: BlackoutDate[] | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}

export const dayLabels: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

export const daysOfWeek: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]
