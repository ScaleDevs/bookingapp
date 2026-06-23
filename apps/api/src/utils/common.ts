import { HonoRequest } from 'hono';

export const getRawBody = async (request: HonoRequest) => {
  const contentLength = request.header('content-length');

  if (contentLength && parseInt(contentLength) > 1024 * 1024) {
    // 1MB limit
    // Skip body logging for large requests
  } else {
    const clonedRequest = request.raw.clone();
    return await clonedRequest.text();
  }
};

/**
 * Extract error message from response body
 *
 * @remarks
 * Tries multiple strategies to extract error information:
 * 1. tRPC error structure (error.data.message)
 * 2. Common error field names (details, error, message, msg, description, etc.)
 * 3. If no error fields found, captures entire body if it's small enough (< 500 chars)
 * 4. Returns undefined if no error information can be extracted
 */
export const extractErrorMessage = async (
  response: Response,
): Promise<string | undefined> => {
  try {
    const clonedResponse = response.clone();
    const body = await clonedResponse.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return undefined;
    }

    // Check for tRPC error structure first: error.data.message
    if (
      typeof body === 'object' && body[0].error && (body[0].error.message || body[0].error.data.message)
    ) {
      const message = String(body[0].error.message || body[0].error.data.message).trim();
      if (message.length > 0) {
        return message;
      }
    }

    // Common error field names to check (in priority order)
    const errorFields = [
      'details',
      'error',
      'message',
      'msg',
      'description',
      'reason',
      'errorMessage',
      'error_message',
      'err',
    ];

    // Try to find error message in common fields
    for (const field of errorFields) {
      if (field in body && body[field] !== null && body[field] !== undefined) {
        const value =
          typeof body[field] === 'object'
            ? JSON.stringify(body[field])
            : String(body[field]);
        if (value.trim().length > 0) {
          return value;
        }
      }
    }

    // If no error fields found, try to capture the entire body if it's small enough
    const bodyString = JSON.stringify(body);
    const maxErrorBodySize = 500; // Maximum size for capturing full error body

    if (bodyString.length <= maxErrorBodySize) {
      // Return a formatted version of the body
      return bodyString;
    }

    // Body is too large, try to extract any string values that might be errors
    const stringValues: string[] = [];
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        stringValues.push(`${key}: ${value}`);
      }
    }

    if (stringValues.length > 0) {
      // Return first few string values (limit to prevent huge messages)
      return stringValues.slice(0, 3).join('; ');
    }

    return undefined;
  } catch {
    // Ignore errors extracting error message
    return undefined;
  }
};


/**
 * Converts datetime/timestamp values to PostgreSQL TIMESTAMP format (UTC)
 * Accepts Date objects, ISO strings, or timestamps and returns a string in format:
 * 'YYYY-MM-DD HH:MM:SS' (UTC)
 */
export const toPostgresTimestamp = (
  value: Date | string | number | null | undefined
): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  try {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else if (typeof value === 'number') {
      date = new Date(value);
    } else {
      return null;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    // Format to PostgreSQL TIMESTAMP format in UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return null;
  }
};

/**
 * Recursively converts all datetime/timestamp values in an object to PostgreSQL TIMESTAMP format
 * Useful for preparing data before inserting into the database
 */
export const convertTimestampsToPostgres = <T extends Record<string, any>>(
  obj: T
): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  const result = { ...obj };

  for (const [key, value] of Object.entries(result)) {
    // Check if the key suggests it's a timestamp field
    const isTimestampField =
      key.toLowerCase().includes('at') ||
      key.toLowerCase().includes('date') ||
      key.toLowerCase().includes('time');

    if (isTimestampField && (value instanceof Date || typeof value === 'string' || typeof value === 'number')) {
      const converted = toPostgresTimestamp(value);
      if (converted !== null) {
        result[key as keyof typeof result] = converted as any;
      }
    } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      // Recursively handle nested objects
      result[key as keyof typeof result] = convertTimestampsToPostgres(value);
    }
  }

  return result;
};