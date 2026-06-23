import type {
  AvailabilityRules,
  BlackoutDate,
  BusinessHoursDay,
  ScheduleData,
} from "./types"

export const mockBusinessHours: BusinessHoursDay[] = [
  { day: "monday", openTime: "08:00", closeTime: "20:00" },
  { day: "tuesday", openTime: "08:00", closeTime: "20:00" },
  { day: "wednesday", openTime: "08:00", closeTime: "20:00" },
  { day: "thursday", openTime: "08:00", closeTime: "20:00" },
  { day: "friday", openTime: "08:00", closeTime: "21:00" },
  { day: "saturday", openTime: "09:00", closeTime: "21:00" },
  { day: "sunday", openTime: "09:00", closeTime: "18:00" },
]

export const mockAvailabilityRules: AvailabilityRules = {
  bookingWindowDays: 30,
  minimumNoticeHours: 2,
  maximumAdvanceBookingDays: 90,
}

export const mockScheduleData: ScheduleData = {
  businessHours: mockBusinessHours,
  availabilityRules: mockAvailabilityRules,
}

export const mockBlackoutDates: BlackoutDate[] = [
  {
    id: "bo-001",
    date: "2026-07-04",
    reason: "Independence Day — facility closed",
  },
  {
    id: "bo-002",
    date: "2026-08-15",
    reason: "Annual maintenance and court resurfacing",
  },
  {
    id: "bo-003",
    date: "2026-12-25",
    reason: "Christmas Day — facility closed",
  },
]
