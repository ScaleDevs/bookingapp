"use client"

import { mockUpcomingReservations } from "./mock-data"
import type { QueryState, UpcomingReservation } from "./types"
import { useMockQuery } from "./use-mock-query"

export function useUpcomingReservations(): QueryState<UpcomingReservation[]> {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/reservations/upcoming
      return mockUpcomingReservations
    },
    isEmpty: (data) => data.length === 0,
  })
}
