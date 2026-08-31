/**
 * Transport-agnostic application error hierarchy.
 *
 * These classes are the single source of truth for business-layer exceptions.
 * They carry no knowledge of HTTP, oRPC, or any transport protocol.
 * The global error pipeline (classifier + handler) is solely responsible for
 * translating these into the correct HTTP status code and response shape.
 */

export type AppErrorCode =
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "UNPROCESSABLE";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly details: Record<string, unknown>;

  constructor(
    code: AppErrorCode,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found.", details?: Record<string, unknown>) {
    super("NOT_FOUND", message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists.", details?: Record<string, unknown>) {
    super("CONFLICT", message, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request.", details?: Record<string, unknown>) {
    super("BAD_REQUEST", message, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed.", details?: Record<string, unknown>) {
    super("VALIDATION_ERROR", message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized.", details?: Record<string, unknown>) {
    super("UNAUTHORIZED", message, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden.", details?: Record<string, unknown>) {
    super("FORBIDDEN", message, details);
  }
}

export class UnprocessableError extends AppError {
  constructor(message = "Unprocessable request.", details?: Record<string, unknown>) {
    super("UNPROCESSABLE", message, details);
  }
}

export class InternalError extends AppError {
  constructor(message = "An internal error occurred.", details?: Record<string, unknown>) {
    super("INTERNAL_ERROR", message, details);
  }
}
