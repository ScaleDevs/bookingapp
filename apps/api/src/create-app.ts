import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requestId, type RequestIdVariables } from 'hono/request-id'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from './router'
import { auth } from './utils/auth'
import { createContext } from './utils/trpc'
import { allowedOrigins } from './utils/constants'
import { auditTrailMiddleware } from './middlewares/audit-trail'
import { env } from './utils/env'

export function createApp() {
    const app = new Hono<{
        Variables: RequestIdVariables & {
            user: typeof auth.$Infer.Session.user | null;
            session: typeof auth.$Infer.Session.session | null
            activeOrganizationId: string | null
        }
    }>();

    /**
     * ******************************
     * ******MIDDLEWARES START*******
     * ******************************
     */
    // This enables request ID generation for all routes
    app.use('*', requestId());

    app.use(
        "*",
        cors({
            origin: origin => {
                if (!origin) return '';
                const allowed = allowedOrigins.includes(origin);
                return allowed ? origin : '';
            },
            allowHeaders: ["Content-Type", "Authorization"],
            allowMethods: ["POST", "GET", "OPTIONS"],
            maxAge: 600,
            credentials: true,
        })
    );

    // set user and session in context
    app.use("*", async (c, next) => {
        const session = await auth.api.getSession({ headers: c.req.raw.headers });

        if (!session) {
            c.set("user", null);
            c.set("session", null);
            await next();
            return;
        }

        c.set("user", session.user);
        c.set("session", session.session);
        c.set("activeOrganizationId", session.session?.activeOrganizationId ?? null);
        await next();
    });

    if (env.STAGE && env.ROOT_DOMAIN)
        /**
        * Audit trail middleware - logs all requests and responses.
        * Applies to all routes (both protected and public).
        * For protected routes that go through verifySignature, uses cached rawBody for efficiency.
        * For public routes, reads body directly when needed.
        *
        * @see {@link auditTrailMiddleware} - Full middleware documentation
        * @see {@link verifySignature} - Sets rawBody in context for protected routes
        * @see {@link events.onError} - Formats error responses after logging
        */
        app.use('/*', auditTrailMiddleware);


    /**
     * ******************************
     * ******MIDDLEWARES END*********
     * ******************************
     */

    /**
     * ******************************
     * ******ROUTES START***********
     * ******************************
     */

    app.get('/health', (c) => {
        return c.json({ status: 'ok', message: 'Service is healthy' })
    })

    // auth routes
    app.on(["POST", "GET"], "/api/auth/*", async (c) => {
        return auth.handler(c.req.raw);
    });

    // trpc routes
    app.all('/api/trpc/*', (c) => {
        const id = c.get('requestId');
        return fetchRequestHandler({
            endpoint: '/api/trpc',
            req: c.req.raw,
            router: appRouter,
            createContext: (opts) => createContext({ ...opts, requestId: id }),
        })
    })

    /**
     * ******************************
     * ******ROUTES END*************
     * ******************************
     */

    return app;
}
