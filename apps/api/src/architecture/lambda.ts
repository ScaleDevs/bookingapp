import { handle } from "hono/aws-lambda";

import { createSharedApp } from "./shared-app";
import type { DomainDefinition } from "./domain";

/**
 * Builds a Lambda handler for one or more domains, reusing the exact same
 * shared app builder as local dev. In production, every domain Lambda is
 * created this way with only itself registered — the shared middleware is
 * never duplicated across handlers.
 */
export function createDomainLambdaHandler(...domains: DomainDefinition[]) {
  const app = createSharedApp({ domains });
  return handle(app);
}
