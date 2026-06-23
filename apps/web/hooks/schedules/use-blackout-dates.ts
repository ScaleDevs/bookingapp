"use client"

import { useMockQuery } from "@/hooks/dashboard/use-mock-query"

import { mockBlackoutDates } from "./mock-data"
import type { BlackoutDatesQueryState } from "./types"

export function useBlackoutDates(): BlackoutDatesQueryState {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/schedules/blackout-dates
      return mockBlackoutDates
    },
    isEmpty: (data) => data.length === 0,
  })
}
