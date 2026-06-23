"use client"

import { mockDashboardStats } from "./mock-data"
import type { DashboardStats, QueryState } from "./types"
import { useMockQuery } from "./use-mock-query"

export function useDashboardStats(): QueryState<DashboardStats> {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/dashboard/stats
      return mockDashboardStats
    },
  })
}
