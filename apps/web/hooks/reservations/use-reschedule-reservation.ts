"use client"

import { useMockMutation } from "@/hooks/offerings/use-mock-mutation"

import type { RescheduleReservationInput } from "./types"

export function useRescheduleReservation() {
  return useMockMutation<RescheduleReservationInput>({
    mutationFn: async (input) => {
      // TODO: Connect mutation — POST /api/reservations/:id/reschedule
      void input
    },
  })
}
