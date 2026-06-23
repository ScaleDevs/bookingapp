"use client"

import { useMockMutation } from "@/hooks/offerings/use-mock-mutation"

import type { ConfirmReservationInput } from "./types"

export function useConfirmReservation() {
  return useMockMutation<ConfirmReservationInput>({
    mutationFn: async (input) => {
      // TODO: Connect mutation — POST /api/reservations/:id/confirm
      void input
    },
  })
}
