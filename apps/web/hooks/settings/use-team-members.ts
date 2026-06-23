"use client"

import { useMockQuery } from "@/hooks/dashboard/use-mock-query"

import { mockTeamMembers } from "./mock-data"
import type { TeamMembersQueryState } from "./types"

export function useTeamMembers(): TeamMembersQueryState {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/settings/team-members
      return mockTeamMembers
    },
    isEmpty: (data) => data.length === 0,
  })
}
