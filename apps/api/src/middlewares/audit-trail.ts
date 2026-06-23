import { createMiddleware } from 'hono/factory';
import { auditLogService } from '../services/audit-log';
import { getRawBody, extractErrorMessage } from '../utils/common';

/**
 * Middleware to log audit trail entries for all requests and responses.
 *
 * @description
 * Captures comprehensive audit information for every request including endpoint,
 * user ID, request metadata, response status, and error messages.
 *
 * @remarks
 * **Data Collected:**
 * - Endpoint path and HTTP method
 * - User ID (from authenticated session, if available)
 * - Request body (parsed JSON if valid, raw string otherwise) - **sensitive fields automatically redacted**
 * - Request parameters (query string parameters) - **sensitive fields automatically redacted**
 * - IP address (from x-forwarded-for or x-real-ip headers)
 * - User agent
 * - Response status (SUCCESS for 2xx, FAILURE otherwise)
 * - Error messages (from response body or thrown errors)
 *
 * **Security:**
 * Request bodies and parameters are automatically sanitized before logging to prevent
 * sensitive data exposure. Fields containing sensitive keywords (password, token, secret,
 * credit_card, etc.) are redacted with '[REDACTED]'.
 *
 * **Request Body Handling:**
 * - Reads body directly for POST/PUT/PATCH requests
 * - Gracefully handles cases where body is unavailable, not JSON, or already consumed
 * - Body reading happens before route handlers execute
 *
 * **Error Handling:**
 * - Catches errors thrown by route handlers
 * - Logs error message to audit trail
 * - Re-throws error so error handlers can format proper HTTP responses
 * - Extracts error messages from response bodies for non-2xx status codes
 *
 * **Performance:**
 * - Audit logging is asynchronous and non-blocking (doesn't await)
 * - Logging failures don't affect request processing
 * - Uses request/response cloning to avoid consuming original streams
 *
 * @example
 * ```typescript
 * // Apply audit trail to all routes
 * app.use('/*', auditTrailMiddleware);
 * ```
 *
 * @see {@link auditLogService} - Service that handles audit log persistence
 */
export const auditTrailMiddleware = createMiddleware(async (c, next) => {
  const endpoint = c.req.path;

  // Skip audit logging for utility endpoints
  const skipPathsPrefixMatch = ['/audit-logs'];
  if (skipPathsPrefixMatch.some(path => endpoint.startsWith(path))) {
    return await next();
  }

  const skipPathsExactMatch = ['/doc', '/doc-spec', '/'];
  if (skipPathsExactMatch.includes(endpoint)) {
    return await next();
  }

  const method = c.req.method;
  const ipAddress =
    c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const userAgent = c.req.header('user-agent') || 'unknown';


  // Extract booking identifier from request body
  // Prefer rawBody from verifySignature middleware if available (more efficient)
  // Fallback to reading body directly if verifySignature didn't run or rawBody not set`
  let rawBody: string | undefined = c.get('rawBody');
  let requestBody: unknown | undefined;

  // for non protected routes, we need to read the body directly
  if (!rawBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    try {
      // Clone request to avoid consuming the original body stream
      rawBody = await getRawBody(c.req);
    } catch {
      // Ignore errors - body might not be available, already consumed, or not cloneable
      // This is expected for some requests (e.g., streaming requests, already consumed bodies)
    }
  }

  // Parse body and extract booking identifier
  // for protected routes, we can use the rawBody from the verifySignature middleware
  if (rawBody) {
    try {
      requestBody = JSON.parse(rawBody);
    } catch {
      // If not JSON, store raw body as string
      // This handles cases where body is not JSON (e.g., form data, plain text)
      requestBody = rawBody;
    }
  }

  // Extract query parameters (only include if there are any)
  const queryParams = c.req.query();
  const requestParams =
    queryParams && Object.keys(queryParams).length > 0 ? queryParams : undefined;

  let status: 'SUCCESS' | 'FAILURE' = 'SUCCESS';
  let errorMessage: string | undefined;

  try {
    await next();

    // Check response status
    const responseStatus = c.res.status;
    if (responseStatus >= 200 && responseStatus < 300) {
      status = 'SUCCESS';
    } else {
      status = 'FAILURE';
      // Extract error message from response body
      errorMessage = await extractErrorMessage(c.res);
      console.error('Error message1:', errorMessage);
    }
  } catch (error) {
    status = 'FAILURE';
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error message2:', errorMessage);
    // Re-throw error so it can be handled by error handlers and proper error responses returned
    throw error;
  } finally {
    // Log audit trail asynchronously (don't await to avoid blocking response)
    auditLogService
      .logAudit({
        endpoint,
        userId: c.get('user')?.id,
        status,
        errorMessage,
        requestMethod: method,
        ipAddress,
        userAgent,
        requestBody,
        requestParams,
      })
      .catch(err => {
        console.error('Failed to log audit trail:', err);
      });
  }
});
