/**
 * Error classifier — the single source of truth for translating any unknown
 * exception into a normalised, transport-agnostic classification.
 */

import { ORPCError } from "@orpc/server";
import * as v from "valibot";

import { AppError, type AppErrorCode } from "./app-error";

export interface ClassifiedError {
  code: AppErrorCode | "UNKNOWN";
  message: string;
  httpStatus: number;
  details: Record<string, unknown>;
  originalError: unknown;
}

interface ErrorMapper {
  canHandle(error: unknown): boolean;
  map(error: unknown): ClassifiedError;
}

function getPostgresCode(error: unknown): string | undefined {
  let current: unknown = error;
  while (current && typeof current === "object") {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string" && /^[0-9A-Z]{5}$/.test(code)) return code;
    current = (current as { cause?: unknown }).cause;
  }
  return undefined;
}

function isPostgresError(error: unknown): boolean {
  return getPostgresCode(error) !== undefined;
}

const appErrorMapper: ErrorMapper = {
  canHandle: (e) => e instanceof AppError,
  map: (e) => {
    const err = e as AppError;
    return {
      code: err.code,
      message: err.message,
      httpStatus: appErrorCodeToHttpStatus(err.code),
      details: err.details,
      originalError: err,
    };
  },
};

const orpcErrorMapper: ErrorMapper = {
  canHandle: (e) => e instanceof ORPCError,
  map: (e) => {
    const err = e as ORPCError<string, unknown>;
    const appCode = orpcCodeToAppCode(String(err.code));
    return {
      code: appCode,
      message: err.message,
      httpStatus: orpcCodeToHttpStatus(String(err.code)),
      details: (err.data as Record<string, unknown>) ?? {},
      originalError: err,
    };
  },
};

const valibotErrorMapper: ErrorMapper = {
  canHandle: (e) => v.isValiError(e),
  map: (e) => {
    const err = e as v.ValiError<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>;
    const issues = v.flatten(err.issues);
    return {
      code: "VALIDATION_ERROR",
      message: "Validation failed.",
      httpStatus: 400,
      details: { issues },
      originalError: err,
    };
  },
};

const postgresErrorMapper: ErrorMapper = {
  canHandle: isPostgresError,
  map: (e) => {
    const pgCode = getPostgresCode(e) ?? "";

    switch (pgCode) {
      case "23505":
        return {
          code: "CONFLICT",
          message: "A resource with this value already exists.",
          httpStatus: 409,
          details: { pgCode },
          originalError: e,
        };
      case "23503":
        return {
          code: "CONFLICT",
          message: "This operation would violate a referential integrity constraint.",
          httpStatus: 409,
          details: { pgCode },
          originalError: e,
        };
      case "23502":
        return {
          code: "BAD_REQUEST",
          message: "A required field is missing.",
          httpStatus: 400,
          details: { pgCode },
          originalError: e,
        };
      case "23514":
        return {
          code: "BAD_REQUEST",
          message: "The provided value violates a data constraint.",
          httpStatus: 400,
          details: { pgCode },
          originalError: e,
        };
      case "22P02":
        return {
          code: "BAD_REQUEST",
          message: "Invalid input format.",
          httpStatus: 400,
          details: { pgCode },
          originalError: e,
        };
      case "22007":
        return {
          code: "BAD_REQUEST",
          message: "Invalid date/time format.",
          httpStatus: 400,
          details: { pgCode },
          originalError: e,
        };
      case "40001":
      case "40P01":
        return {
          code: "INTERNAL_ERROR",
          message: "A transient database conflict occurred. Please retry.",
          httpStatus: 500,
          details: { pgCode },
          originalError: e,
        };
      default:
        if (pgCode.startsWith("08")) {
          return {
            code: "INTERNAL_ERROR",
            message: "Database connection error.",
            httpStatus: 503,
            details: { pgCode },
            originalError: e,
          };
        }

        return {
          code: "INTERNAL_ERROR",
          message: "A database error occurred.",
          httpStatus: 500,
          details: { pgCode },
          originalError: e,
        };
    }
  },
};

const fallbackMapper: ErrorMapper = {
  canHandle: () => true,
  map: (e) => ({
    code: "UNKNOWN",
    message: "An unexpected error occurred.",
    httpStatus: 500,
    details: {},
    originalError: e,
  }),
};

const mappers: ErrorMapper[] = [
  appErrorMapper,
  orpcErrorMapper,
  valibotErrorMapper,
  postgresErrorMapper,
  fallbackMapper,
];

export function classifyError(error: unknown): ClassifiedError {
  for (const mapper of mappers) {
    if (mapper.canHandle(error)) {
      return mapper.map(error);
    }
  }
  return fallbackMapper.map(error);
}

function appErrorCodeToHttpStatus(code: AppErrorCode): number {
  switch (code) {
    case "NOT_FOUND": return 404;
    case "CONFLICT": return 409;
    case "BAD_REQUEST": return 400;
    case "VALIDATION_ERROR": return 400;
    case "UNAUTHORIZED": return 401;
    case "FORBIDDEN": return 403;
    case "UNPROCESSABLE": return 422;
    case "INTERNAL_ERROR": return 500;
    default: return 500;
  }
}

export function orpcCodeToHttpStatus(code: string): number {
  const appCode = orpcCodeToAppCode(code);
  if (appCode === "UNKNOWN") return 500;
  return appErrorCodeToHttpStatus(appCode);
}

function orpcCodeToAppCode(code: string): AppErrorCode | "UNKNOWN" {
  switch (code) {
    case "NOT_FOUND": return "NOT_FOUND";
    case "BAD_REQUEST": return "BAD_REQUEST";
    case "PARSE_ERROR": return "BAD_REQUEST";
    case "UNAUTHORIZED": return "UNAUTHORIZED";
    case "FORBIDDEN": return "FORBIDDEN";
    case "CONFLICT": return "CONFLICT";
    case "UNPROCESSABLE_CONTENT": return "UNPROCESSABLE";
    case "INTERNAL_SERVER_ERROR": return "INTERNAL_ERROR";
    default: return "UNKNOWN";
  }
}

type OrpcErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_CONTENT"
  | "INTERNAL_SERVER_ERROR";

export function appErrorToOrpcCode(code: AppErrorCode): OrpcErrorCode {
  switch (code) {
    case "NOT_FOUND": return "NOT_FOUND";
    case "CONFLICT": return "CONFLICT";
    case "BAD_REQUEST": return "BAD_REQUEST";
    case "VALIDATION_ERROR": return "BAD_REQUEST";
    case "UNAUTHORIZED": return "UNAUTHORIZED";
    case "FORBIDDEN": return "FORBIDDEN";
    case "UNPROCESSABLE": return "UNPROCESSABLE_CONTENT";
    case "INTERNAL_ERROR": return "INTERNAL_SERVER_ERROR";
    default: return "INTERNAL_SERVER_ERROR";
  }
}
