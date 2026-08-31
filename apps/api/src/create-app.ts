import { createSharedApp } from "./architecture/shared-app";
import { domains } from "./routes/registry";
import { openapiRouter } from "./routes/openapi-router";

/**
 * Local development composition root: registers every available domain onto
 * a single Hono app, mirroring what happens in production across many
 * per-domain Lambdas (see `server.ts`).
 */
export function createApp() {
  return createSharedApp({ domains, openapiRouter });
}
