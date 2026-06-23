// src/lib/auth-server.ts

import { cookies } from "next/headers"
import { getBaseApiUrl } from "./constant"

export type Session = {
    session: {
        expiresAt: string
        token: string
        createdAt: string
        updatedAt: string
        ipAddress: string
        userAgent: string
        userId: string
        activeOrganizationId: string | null
        id: string
    }
    user: {
        name: string
        email: string
        emailVerified: boolean
        image: string | null
        createdAt: string
        updatedAt: string
        id: string
    }
}


export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies()

    const response = await fetch(
        `${getBaseApiUrl()}/api/auth/get-session`,
        {
            headers: {
                cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    )

    if (!response.ok) {
        return null
    }

    const data = await response.json()

    return data as Session
}