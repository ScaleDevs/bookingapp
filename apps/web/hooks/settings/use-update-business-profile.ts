"use client"

import { useMockMutation } from "@/hooks/offerings/use-mock-mutation"

import type { UpdateBusinessProfileInput } from "./types"

export function useUpdateBusinessProfile() {
  return useMockMutation<UpdateBusinessProfileInput>({
    mutationFn: async (input) => {
      // TODO: Connect mutation — PUT /api/settings/business-profile
      void input
    },
  })
}
