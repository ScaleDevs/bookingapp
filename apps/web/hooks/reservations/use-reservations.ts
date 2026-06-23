"use client"

import { useMockQuery } from "@/hooks/dashboard/use-mock-query"

import { mockReservations } from "./mock-data"
import type { ReservationsQueryState } from "./types"

export function useReservations(): ReservationsQueryState {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/reservations
      return mockReservations
    },
    isEmpty: (data) => data.length === 0,
  })
}
