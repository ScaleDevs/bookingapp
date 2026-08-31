import { SmartCoercionHandlerPlugin } from "@orpc/json-schema";
import type { AnyRouter } from "@orpc/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { ValibotToJsonSchemaConverter } from "@orpc/valibot";
import type { Context } from "hono";

import { createLogger } from "../../utils/logger";
import type { SharedApp } from "../types";
import { createOrpcContext } from "./context";
import { appErrorInterceptor, classifyAndLogInterceptor } from "../../errors/interceptors";
import type { ApiErrorResponse } from "../../errors/handler";
import { toContentfulStatusCode } from "../../errors/http-status";

const logger = createLogger("OpenAPI");

const valibotJsonSchemaConverter = new ValibotToJsonSchemaConverter();

/**
 * Mounts an oRPC OpenAPI router onto a Hono app at the given base path.
 * Domains call this from their `register` function — the shared app builder
 * stays unaware of oRPC internals.
 *
 * Error pipeline (in order):
 * 1. `classifyAndLogInterceptor` — outermost wrapper; classifies every
 *    exception, logs it with structured metadata, converts it to ORPCError.
 * 2. `appErrorInterceptor` — converts domain AppErrors to ORPCError so oRPC
 *    picks up the correct HTTP status code.
 *
 * After oRPC produces its response, any 4xx/5xx is reformatted to the
 * standard `ApiErrorResponse` shape before being sent to the client.
 */
export function mountOpenApiRouter(
  app: SharedApp,
  options: {
    basePath: string;
    /** Prefix passed to OpenAPIHandler.handle — must match contract route paths. */
    apiPrefix: string;
    router: AnyRouter;
  },
) {
  const handler = new OpenAPIHandler(options.router, {
    plugins: [
      new SmartCoercionHandlerPlugin({
        converters: [valibotJsonSchemaConverter],
      }),
    ],
    interceptors: [
      classifyAndLogInterceptor as any,
      appErrorInterceptor as any,
    ],
  });

  const handleRequest = async (
    c: Context<{ Variables: import("../types").SharedAppVariables }>,
  ) => {
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: options.apiPrefix as `/${string}`,
      context: createOrpcContext(c),
    });

    if (!matched) {
      return c.notFound();
    }

    if (response.status >= 400) {
      return reformatErrorResponse(c, response);
    }

    return c.newResponse(response.body, response);
  };

  app.on(["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], options.basePath, handleRequest);
  app.on(["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], `${options.basePath}/*`, handleRequest);
}

async function reformatErrorResponse(
  c: Context<{ Variables: import("../types").SharedAppVariables }>,
  response: Response,
): Promise<Response> {
  try {
    const raw = await response.json() as Record<string, unknown>;

    const code = (raw.code as string | undefined) ?? "INTERNAL_ERROR";
    const message = (raw.message as string | undefined) ?? "An error occurred.";
    const details = (raw.data as Record<string, unknown> | undefined) ?? {};

    const requestId = (c.get as (key: string) => string | undefined)("requestId");

    const body: ApiErrorResponse = {
      code,
      message,
      details,
      requestId,
      timestamp: new Date().toISOString(),
      path: c.req.path,
    };

    return c.json(body, toContentfulStatusCode(response.status));
  } catch {
    logger.warn("Failed to reformat oRPC error response — returning original");
    return c.newResponse(response.body, response);
  }
}
