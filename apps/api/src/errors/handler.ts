import type { Context } from "hono";

import { createLogger } from "../utils/logger";
import { classifyError } from "./classifier";
import { toContentfulStatusCode } from "./http-status";

const logger = createLogger("ErrorHandler");

export interface ApiErrorResponse {
  code: string;
  message: string;
  details: Record<string, unknown>;
  requestId: string | undefined;
  timestamp: string;
  path: string;
}

export interface ErrorLogContext {
  requestId?: string | null;
  method?: string;
  path?: string;
  userId?: string | null;
  organizationId?: string | null;
  errorCode?: string;
  httpStatus?: number;
  errorType?: string;
  stack?: string;
}

export function logStructuredError(
  error: unknown,
  context: ErrorLogContext,
): void {
  const isClientError =
    context.httpStatus !== undefined &&
    context.httpStatus >= 400 &&
    context.httpStatus < 500;

  const entry = {
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    userId: context.userId,
    organizationId: context.organizationId,
    errorCode: context.errorCode,
    httpStatus: context.httpStatus,
    errorType: context.errorType ?? (error instanceof Error ? error.constructor.name : typeof error),
    stack: context.stack,
  };

  if (isClientError) {
    logger.warn("Client error", entry);
  } else {
    logger.error("Server error", entry, error instanceof Error ? error.message : error);
  }
}

export function buildErrorResponse(
  c: Context,
  classified: ReturnType<typeof classifyError>,
): Response {
  const requestId = (c.get as (key: string) => string | undefined)("requestId");

  const body: ApiErrorResponse = {
    code: classified.code,
    message: classified.message,
    details: classified.details,
    requestId,
    timestamp: new Date().toISOString(),
    path: c.req.path,
  };

  return c.json(body, toContentfulStatusCode(classified.httpStatus));
}

export function globalErrorHandler(error: Error | unknown, c: Context): Response {
  const classified = classifyError(error);

  logStructuredError(error, {
    requestId: (c.get as (key: string) => string | undefined)("requestId"),
    method: c.req.method,
    path: c.req.path,
    errorCode: classified.code,
    httpStatus: classified.httpStatus,
    stack: error instanceof Error ? error.stack : undefined,
  });

  return buildErrorResponse(c, classified);
}
