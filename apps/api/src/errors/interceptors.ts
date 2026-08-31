/**
 * oRPC interceptors for the error pipeline.
 *
 * Registration order matters — `classifyAndLogInterceptor` must be listed
 * *before* `appErrorInterceptor` so it wraps the entire chain.
 */

import { ORPCError } from "@orpc/server";

import { AppError, type AppErrorCode } from "./app-error";
import { classifyError, appErrorToOrpcCode } from "./classifier";
import { logStructuredError } from "./handler";

interface InterceptorOptions {
  context: {
    service?: {
      requestId?: string | null;
      organizationId?: string;
    };
    user?: { id?: string } | null;
  };
  path?: string[];
  next: () => Promise<unknown>;
}

export async function appErrorInterceptor(options: InterceptorOptions): Promise<unknown> {
  try {
    return await options.next();
  } catch (error) {
    if (error instanceof AppError) {
      throw new ORPCError(appErrorToOrpcCode(error.code), {
        message: error.message,
        data: Object.keys(error.details).length > 0 ? error.details : undefined,
      });
    }
    throw error;
  }
}

export async function classifyAndLogInterceptor(options: InterceptorOptions): Promise<unknown> {
  const { context, path, next } = options;

  try {
    return await next();
  } catch (error) {
    if (error instanceof ORPCError) {
      const classified = classifyError(error);
      logStructuredError(error, {
        requestId: context.service?.requestId,
        path: path?.join("/"),
        userId: context.user?.id,
        organizationId: context.service?.organizationId,
        errorCode: classified.code,
        httpStatus: classified.httpStatus,
        stack: error.stack,
      });
      throw error;
    }

    const classified = classifyError(error);

    logStructuredError(error, {
      requestId: context.service?.requestId,
      path: path?.join("/"),
      userId: context.user?.id,
      organizationId: context.service?.organizationId,
      errorCode: classified.code,
      httpStatus: classified.httpStatus,
      stack: error instanceof Error ? error.stack : undefined,
    });

    const orpcCode = classified.code === "UNKNOWN"
      ? "INTERNAL_SERVER_ERROR"
      : appErrorToOrpcCode(classified.code as AppErrorCode);

    throw new ORPCError(orpcCode, {
      message: classified.message,
      data: Object.keys(classified.details).length > 0 ? classified.details : undefined,
    });
  }
}
