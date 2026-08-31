/**
 * Public API for the error handling pipeline.
 *
 * Import everything your code needs from `@errors`.
 */

export {
  AppError,
  type AppErrorCode,
  NotFoundError,
  ConflictError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  UnprocessableError,
  InternalError,
} from "./app-error";

export { classifyError, appErrorToOrpcCode, orpcCodeToHttpStatus, type ClassifiedError } from "./classifier";

export { toContentfulStatusCode } from "./http-status";

export {
  globalErrorHandler,
  buildErrorResponse,
  logStructuredError,
  type ApiErrorResponse,
  type ErrorLogContext,
} from "./handler";

export { appErrorInterceptor, classifyAndLogInterceptor } from "./interceptors";
