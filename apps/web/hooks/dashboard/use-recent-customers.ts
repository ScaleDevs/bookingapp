"use client"

import { mockRecentCustomers } from "./mock-data"
import type { QueryState, RecentCustomer } from "./types"
import { useMockQuery } from "./use-mock-query"

export function useRecentCustomers(): QueryState<RecentCustomer[]> {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/customers/recent
      return mockRecentCustomers
    },
    isEmpty: (data) => data.length === 0,
  })
}
