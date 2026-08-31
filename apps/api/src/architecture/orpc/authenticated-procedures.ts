import type { RouterContract } from "@orpc/contract";
import {
  implement,
  type Implementer,
  type RouterImplementerWithMiddlewares,
} from "@orpc/server";

import { createLogger } from "../../utils/logger";
import { UnauthorizedError } from "../../errors/app-error";

import type { AuthenticatedOrpcContext, OrpcContext } from "./context";

const logger = createLogger("Auth");

type OrpcImplementer<TContract extends RouterContract> = Implementer<
  TContract,
  OrpcContext
>;

type AuthenticatedRouterImplementer<TContract extends RouterContract> =
  RouterImplementerWithMiddlewares<
    TContract,
    OrpcContext,
    AuthenticatedOrpcContext
  >;

function applyRequireAuth<TContract extends RouterContract>(
  os: OrpcImplementer<TContract>,
): AuthenticatedRouterImplementer<TContract> {
  // Router-level implementers expose `middleware`/`use`; cast internally
  // because `Implementer` is a union that includes single-procedure contracts.
  const routerOs = os as OrpcImplementer<TContract> & {
    middleware: (
      fn: (options: {
        context: OrpcContext;
        next: (options: { context: AuthenticatedOrpcContext }) => unknown;
      }) => unknown,
    ) => unknown;
    use: (middleware: unknown) => AuthenticatedRouterImplementer<TContract>;
  };

  const requireAuth = routerOs.middleware(async ({ context, next }) => {
    if (!context.user || !context.session) {
      throw new UnauthorizedError(
        "You must be logged in to access this resource.",
      );
    }

    if (!context.service.organizationId) {
      throw new UnauthorizedError(
        "You must be logged in to access this resource. Please select an organization.",
      );
    }

    logger.info(
      `[requestId: ${context.service.requestId} orgId: ${context.service.organizationId}] user: ${context.user.id} authenticated`,
    );

    const authenticatedContext: AuthenticatedOrpcContext = {
      user: context.user,
      session: context.session,
      service: context.service,
    };

    return next({
      context: authenticatedContext,
    });
  });

  return routerOs.use(requireAuth);
}

/**
 * Creates an oRPC implementer with shared session + organization
 * authentication already applied. Preferred entry point for domain routers.
 */
export function createAuthenticatedImplementer<
  const TContract extends RouterContract,
>(
  contract: TContract,
): { pub: OrpcImplementer<TContract>; authed: AuthenticatedRouterImplementer<TContract> } {
  const os = implement(contract).$context<OrpcContext>();
  const authed = applyRequireAuth(os);
  return { pub: os, authed };
}

/**
 * Applies shared authentication to an existing oRPC implementer. Use this
 * when a domain needs to configure the implementer before authentication
 * (e.g. additional context or middleware ordering).
 */
export function createAuthenticatedProcedures<
  const TContract extends RouterContract,
>(
  os: OrpcImplementer<TContract>,
): { pub: OrpcImplementer<TContract>; authed: AuthenticatedRouterImplementer<TContract> } {
  return { pub: os, authed: applyRequireAuth(os) };
}
