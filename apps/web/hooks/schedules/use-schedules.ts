"use client"

import { useMockQuery } from "@/hooks/dashboard/use-mock-query"

import { mockScheduleData } from "./mock-data"
import type { SchedulesQueryState } from "./types"

export function useSchedules(): SchedulesQueryState {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/schedules
      return mockScheduleData
    },
    isEmpty: () => false,
  })
}
