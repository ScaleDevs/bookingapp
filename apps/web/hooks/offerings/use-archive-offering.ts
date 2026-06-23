"use client"

import type { ArchiveOfferingInput } from "./types"
import { useMockMutation } from "./use-mock-mutation"

export function useArchiveOffering() {
  return useMockMutation<ArchiveOfferingInput>({
    mutationFn: async (input) => {
      // TODO: Connect mutation — POST /api/offerings/:id/archive
      void input
    },
  })
}
