import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestId, type RequestIdVariables } from 'hono/request-id';
import { RPCHandler } from '@orpc/server/fetch';
import { OpenAPIGenerator } from '@orpc/openapi';
import { experimental_ValibotToJsonSchemaConverter } from '@orpc/valibot';

import { router, type ApiContext } from './router';
import { auth } from './utils/auth';
import { allowedOrigins } from './utils/constants';
import { auditTrailMiddleware } from './middlewares/audit-trail';
import { env } from './utils/env';
import { db } from './db';
import { createLogger } from './utils/logger';
import { toORPCError } from './router';

const logger = createLogger('oRPC');

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    async ({ next }) => {
      try {
        return await next();
      } catch (error) {
        logger.error('oRPC request failed', { error });
        throw toORPCError(error);
      }
    },
  ],
});

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [new experimental_ValibotToJsonSchemaConverter()],
});

type AppVariables = RequestIdVariables & {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  activeOrganizationId: string | null;
};

function createContext(c: { get: (key: keyof AppVariables) => unknown }): ApiContext {
  const user = c.get('user') as AppVariables['user'];
  const session = c.get('session') as AppVariables['session'];
  const requestId = c.get('requestId') as string | undefined;

  return {
    db,
    requestId: requestId ?? null,
    user,
    session,
    service: {
      organizationId: session?.activeOrganizationId ?? '',
      requestId: requestId ?? null,
    },
  };
}

export function createApp() {
  const app = new Hono<{ Variables: AppVariables }>();

  app.use('*', requestId());

  app.use(
    '*',
    cors({
      origin: (origin) => {
        if (!origin) return '';
        return allowedOrigins.includes(origin) ? origin : '';
      },
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
      maxAge: 600,
      credentials: true,
    }),
  );

  app.use('*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    c.set('user', session?.user ?? null);
    c.set('session', session?.session ?? null);
    c.set('activeOrganizationId', session?.session?.activeOrganizationId ?? null);
    await next();
  });

  if (env.STAGE && env.ROOT_DOMAIN) {
    app.use('/*', auditTrailMiddleware);
  }

  app.get('/health', (c) => c.json({ status: 'ok', message: 'Service is healthy' }));

  app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

  app.all('/api/orpc/*', async (c, next) => {
    const { matched, response } = await rpcHandler.handle(c.req.raw, {
      prefix: '/api/orpc',
      context: createContext(c),
    });

    if (matched) {
      return c.newResponse(response.body, response);
    }

    await next();
  });

  app.get('/api/openapi.json', async (c) => {
    const spec = await openAPIGenerator.generate(router, {
      info: {
        title: 'BookingApp API',
        version: '1.0.0',
      },
      servers: [{ url: '/api/orpc' }],
    });

    return c.json(spec);
  });

  return app;
}

export type { AppVariables };
