"use client"

import { useMockMutation } from "@/hooks/offerings/use-mock-mutation"

import type { UpdateBusinessHoursInput } from "./types"

export function useUpdateBusinessHours() {
  return useMockMutation<UpdateBusinessHoursInput>({
    mutationFn: async (input) => {
      // TODO: Connect mutation — PUT /api/schedules/business-hours
      void input
    },
  })
}
