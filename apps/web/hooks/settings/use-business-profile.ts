"use client"

import { useMockQuery } from "@/hooks/dashboard/use-mock-query"

import { mockBusinessProfile } from "./mock-data"
import type { BusinessProfileQueryState } from "./types"

export function useBusinessProfile(): BusinessProfileQueryState {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/settings/business-profile
      return mockBusinessProfile
    },
    isEmpty: () => false,
  })
}
