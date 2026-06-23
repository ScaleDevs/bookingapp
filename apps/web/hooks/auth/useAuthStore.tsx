import { create } from "zustand"
import { authClient } from "@/lib/auth-client"
import type { User } from "better-auth/client"

type AuthSession = {
  data: {
    user: User
    session: {
      id: string
      createdAt: Date
      updatedAt: Date
      userId: string
      expiresAt: Date
      token: string
      ipAddress?: string | null | undefined
      userAgent?: string | null | undefined
      activeOrganizationId?: string | null | undefined
    }
  } | null
  error: {
    code?: string | undefined | undefined
    message?: string | undefined | undefined
    status: number
    statusText: string
  } | null
}

interface AuthState {
  authSession: AuthSession | null
  isInitialized: boolean
  setSession: (session: AuthSession) => void
  clearSession: () => void
  setInitialized: (value: boolean) => void
  getSession: () => Promise<AuthSession | null>
  setActiveOrganizationId: (organizationId: string) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authSession: null,
  isInitialized: false,

  setSession: (session) => set({ authSession: session }),
  setActiveOrganizationId: (organizationId) => {
    const currentSession = get().authSession
    if (!currentSession) return
    if (!currentSession.data) return
    if (!currentSession.data.session) return
    set({
      authSession: {
        ...currentSession,
        data: {
          ...currentSession.data,
          session: {
            ...currentSession.data.session,
            activeOrganizationId: organizationId,
          },
        },
      },
    })
  },
  clearSession: () => set({ authSession: null }),
  setInitialized: (value) => set({ isInitialized: value }),
  getSession: async () => {
    const currentSession = get().authSession
    const currentSessionExpiresAt = currentSession?.data?.session.expiresAt

    if (currentSessionExpiresAt) {
      const expiresAt = new Date(currentSessionExpiresAt)
      const now = new Date()

      if (expiresAt > now) return currentSession

      return null
    }

    const newSession = await authClient.getSession()

    set({ authSession: newSession })
    return newSession
  },
}))
