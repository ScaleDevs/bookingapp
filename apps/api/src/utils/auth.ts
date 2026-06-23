import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "../db"
import { env } from "./env"
import * as authSchema from "../db/auth-schema"
import { allowedOrigins, betterAuthUrl, isDeployed } from "./constants"

/**
 * Determines if the URL uses HTTPS
 */
function isSecureBackend(url: string): boolean {
    try {
        return new URL(url).protocol === 'https:';
    } catch {
        return false;
    }
}

// Determine cookie settings based on backend URL
const isBackendSecure = isSecureBackend(betterAuthUrl);

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: betterAuthUrl,
    trustedOrigins: allowedOrigins,
    basePath: '/api/auth',

    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: authSchema,
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (update session after 1 day of inactivity)
    },

    advanced: {
        defaultCookieAttributes: {
            httpOnly: true,
            // Use secure cookies when backend is HTTPS (required for sameSite: 'none')

            secure: isBackendSecure,

            // Use 'none' for cross-site cookies (localhost frontend -> HTTPS backend)
            // Use 'lax' for same-site cookies (HTTP localhost -> HTTP localhost)
            sameSite: isDeployed ? 'none' : 'lax',

            path: '/',
        },
        // Cross-subdomain cookie sharing for production
        crossSubDomainCookies:
            isDeployed
                ? {
                    enabled: true,
                    domain: `.${env.ROOT_DOMAIN}`,
                }
                : undefined,
    },

    plugins: [
        organization(),
    ]
})