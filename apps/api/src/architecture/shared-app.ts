import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";

import { auth } from "../utils/auth";
import { allowedOrigins } from "../utils/constants";
import { auditTrailMiddleware } from "../middlewares/audit-trail";
import { env } from "../utils/env";
import { globalErrorHandler } from "../errors/handler";

import type { AnyRouter } from "@orpc/server";

import type { DomainDefinition } from "./domain";
import type { SharedApp } from "./types";
import { mountOpenApiDocs } from "./orpc/openapi-docs";

export interface CreateSharedAppOptions {
  /** Domains to mount. Local dev passes every domain; a Lambda passes only its own. */
  domains: DomainDefinition[];
  /** When provided, mounts `/openapi.json` and `/docs` (Scalar UI). */
  openapiRouter?: AnyRouter;
}

/**
 * Builds the Hono application shared by every deployment target (local dev
 * server and per-domain Lambda handlers).
 *
 * Only cross-cutting concerns live here: request id, CORS, session
 * hydration, audit trail, and the `/health` endpoint. Business routes are
 * owned by individual domains and mounted via `domain.register(app)` —
 * this builder has no knowledge of how any domain implements its routes.
 */
export function createSharedApp({
  domains,
  openapiRouter,
}: CreateSharedAppOptions): SharedApp {
  const app: SharedApp = new Hono();

  app.use("*", requestId());

  app.use(
    "*",
    cors({
      origin: (origin) => {
        if (!origin) return "";
        return allowedOrigins.includes(origin) ? origin : "";
      },
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 600,
      credentials: true,
    }),
  );

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

  if (env.STAGE && env.ROOT_DOMAIN) {
    app.use("/*", auditTrailMiddleware);
  }

  app.get("/health", (c) => {
    return c.json({ status: "ok", message: "Service is healthy" });
  });

  if (openapiRouter) {
    mountOpenApiDocs(app, openapiRouter);
  }

  for (const domain of domains) {
    domain.register(app);
  }

  app.onError(globalErrorHandler);

  return app;
}
