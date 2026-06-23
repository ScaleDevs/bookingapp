"use client"

import { useMockQuery } from "@/hooks/dashboard/use-mock-query"

import { mockCustomers } from "./mock-data"
import type { CustomersQueryState } from "./types"

export function useCustomers(): CustomersQueryState {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/customers
      return mockCustomers
    },
    isEmpty: (data) => data.length === 0,
  })
}
