import { initTRPC, TRPCError, StandardSchemaV1Error } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { auth } from "./auth";
import { db } from "../db";
import { createLogger } from "./logger";

const logger = createLogger('TRPC');

export type CreateContextOptions = FetchCreateContextFnOptions & {
  /** Set by Hono `requestId()` middleware (see create-app tRPC route). */
  requestId?: string | null;
};

export const createContext = async (opts: CreateContextOptions) => {
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  const requestId =
    opts.requestId ??
    opts.req.headers.get('x-request-id') ??
    null;

  return {
    session: session?.session ?? null,
    user: session?.user ?? null,
    service: {
      organizationId: session?.session?.activeOrganizationId ?? '',
      requestId: requestId ?? null,
    },
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,

  errorFormatter({ shape, error, type, path, input, ctx }) {
    logger.error("💥 Error in tRPC route:", {
      path: path,
      type: type,
      input: input,
      error: error,
      message: error.message,
    });

    // Check if this is a schema validation error (Valibot via Standard Schema)
    const validationError =
      error.cause instanceof StandardSchemaV1Error
        ? error.cause
        : error instanceof StandardSchemaV1Error
          ? error
          : null;

    if (validationError) {
      const validationMessages = validationError.issues.map(
        (issue) => issue.message
      );
      const errorMessage = validationMessages.join(", ");

      return {
        ...shape,
        data: {
          ...shape.data,
          code: "BAD_REQUEST",
          message: errorMessage,
        },
      };
    }

    // You can log, transform, or filter stack traces here
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
        // Custom field
        message: error.message,
      },
    };
  },
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    // Throwing an error prevents the procedure from running
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.'
    });
  }

  if (!ctx.service.organizationId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource. Please select an organization.'
    });
  }

  logger.info(`[requestId: ${ctx.service.requestId} orgId: ${ctx.service.organizationId}] user: ${ctx.user.id} authenticated`);

  // By passing the user and session to next(), we inform TypeScript that they are now non-null
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      session: ctx.session,
      service: ctx.service,
    },
  });
});

export const protectedProcedure = baseProcedure.use(isAuthed);