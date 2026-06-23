"use client"

import { useMockQuery } from "@/hooks/dashboard/use-mock-query"

import { mockNotificationSettings } from "./mock-data"
import type { NotificationSettingsQueryState } from "./types"

export function useNotificationSettings(): NotificationSettingsQueryState {
  return useMockQuery({
    queryFn: async () => {
      // TODO: Replace with API call — GET /api/settings/notifications
      return mockNotificationSettings
    },
    isEmpty: () => false,
  })
}
