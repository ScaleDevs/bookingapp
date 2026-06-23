"use client"

import { useMockMutation } from "@/hooks/offerings/use-mock-mutation"

import type { CancelReservationInput } from "./types"

export function useCancelReservation() {
  return useMockMutation<CancelReservationInput>({
    mutationFn: async (input) => {
      // TODO: Connect mutation — POST /api/reservations/:id/cancel
      void input
    },
  })
}
