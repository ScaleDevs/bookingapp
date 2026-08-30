export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR';

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(options: { code: ApiErrorCode; message: string; cause?: unknown }) {
    super(options.message, { cause: options.cause });
    this.name = 'ApiError';
    this.code = options.code;
  }
}
