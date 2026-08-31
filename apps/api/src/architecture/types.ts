import type { Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";

import type { auth } from "../utils/auth";

/**
 * Context populated by the shared app builder before any domain route runs.
 * Domains read from this via Hono's `c.get(...)` — they never construct it.
 */
export type SharedAppVariables = RequestIdVariables & {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  activeOrganizationId: string | null;
};

/**
 * The Hono application type every domain registers itself onto, whether
 * running locally (all domains registered) or in a per-domain Lambda
 * (single domain registered).
 */
export type SharedApp = Hono<{ Variables: SharedAppVariables }>;
