import type { Context } from "hono";

import type { BaseService } from "../../utils/types";
import type { auth } from "../../utils/auth";
import type { SharedAppVariables } from "../types";

export type OrpcContext = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  service: BaseService;
};

/** Context shape after `requireAuth` middleware has validated the session. */
export type AuthenticatedOrpcContext = {
  user: NonNullable<OrpcContext["user"]>;
  session: NonNullable<OrpcContext["session"]>;
  service: BaseService & { organizationId: string };
};

export function createOrpcContext(
  c: Context<{ Variables: SharedAppVariables }>,
): OrpcContext {
  return {
    user: c.get("user"),
    session: c.get("session"),
    service: {
      requestId: c.get("requestId") ?? null,
      organizationId: c.get("activeOrganizationId") ?? "",
    },
  };
}
