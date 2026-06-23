import { randomUUID } from 'node:crypto';

import { AuditLog, formatCreatedAtMsKey } from '../db/dynamo';

export interface AuditLogInput {
  userId?: string;
  endpoint: string;
  status: 'SUCCESS' | 'FAILURE';
  errorMessage?: string;
  requestMethod: string;
  ipAddress?: string;
  userAgent?: string;
  requestBody?: unknown;
  requestParams?: Record<string, string>;
}

export class AuditLogService {
  // Track audit log failures for monitoring
  private failureCount = 0;
  private lastFailureTime: Date | null = null;

  /**
   * List of sensitive field keywords that should be redacted from logs
   *
   * @remarks
   * Includes both security-sensitive fields (passwords, tokens) and personally
   * identifiable information (PII) such as emails, phone numbers, and names.
   */
  private readonly sensitiveFields = [
    // Security and authentication fields
    'password',
    'token',
    'secret',
    'api_key',
    'apikey',
    'credit_card',
    'creditcard',
    'cvv',
    'ssn',
    'access_token',
    'refresh_token',
    'authorization',
    'auth',
    'private_key',
    'privatekey',
    'session',
    'cookie',
    'bearer',
    // Personally Identifiable Information (PII)
    'email', // Matches: customerEmail, email, contact_person.email, etc.
    'phone', // Matches: phone, contact_person.phone
    'contact', // Matches: customerContactNo, contact_no, contactNo
    'name', // Matches: customerName, firstName, lastName, first_name, last_name, name
    'age', // Matches: customerAge, age
  ];

  private readonly dontRedactFields = [
    'package_link',
    'package_name',
    'package_id',
    'package_type',
    'package_status',
    'package_created_at',
    'package_updated_at',
    'package_deleted_at',
  ];

  /**
   * Sanitize data by redacting sensitive fields
   *
   * @remarks
   * Recursively sanitizes objects and arrays to redact sensitive fields.
   * Fields whose keys contain any sensitive keyword (case-insensitive) will have
   * their values replaced with '[REDACTED]'.
   *
   * @param data - The data to sanitize
   * @returns Sanitized data with sensitive fields redacted
   */
  private sanitizeData(data: unknown): unknown {
    // Return primitive values as-is
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    // Handle objects
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();

      // Check if key contains any sensitive field keyword
      let isSensitive = false;
      for (let i = 0; i < this.sensitiveFields.length; i++) {
        if (lowerKey.includes(this.sensitiveFields[i])) {
          isSensitive = true;
          break;
        }
      }

      if (this.dontRedactFields.includes(key)) {
        sanitized[key] = value;
      } else if (isSensitive) {
        // Check if the value is empty, null, or undefined before redacting
        if (value === null || value === undefined || value === '') {
          sanitized[key] = '[EMPTY]';
        } else {
          sanitized[key] = '[REDACTED]';
        }
      } else if (value && typeof value === 'object') {
        // Recursively sanitize nested objects and arrays
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Truncate data if it exceeds the maximum size limit
   *
   * @remarks
   * Prevents storing excessively large payloads in audit logs by truncating
   * data that exceeds the size limit. Adds a truncation marker to indicate
   * that the data was truncated.
   *
   * @param data - The data to truncate
   * @param maxSizeBytes - Maximum size in bytes (default: 10KB)
   * @returns Truncated data with truncation marker if applicable
   */
  private truncateIfNeeded(data: unknown, maxSizeBytes: number = 10 * 1024): unknown {
    if (!data) {
      return data;
    }

    try {
      // Convert to JSON string to check size
      const jsonString = JSON.stringify(data);
      const sizeBytes = Buffer.byteLength(jsonString, 'utf8');

      // If within limit, return as-is
      if (sizeBytes <= maxSizeBytes) {
        return data;
      }

      // If data is a string, truncate directly
      if (typeof data === 'string') {
        const truncated = data.substring(0, maxSizeBytes - 50); // Reserve space for marker
        return `${truncated}...[TRUNCATED: ${sizeBytes} bytes]`;
      }

      // For objects/arrays, try to truncate by removing nested data
      const truncated = this.simplifyData(data, maxSizeBytes);

      // Check final size
      const finalJson = JSON.stringify(truncated);
      const finalSize = Buffer.byteLength(finalJson, 'utf8');

      if (finalSize > maxSizeBytes) {
        return {
          _truncated: true,
          _originalSizeBytes: sizeBytes,
          _message: `Data truncated: original size ${sizeBytes} bytes exceeds limit of ${maxSizeBytes} bytes`,
        };
      }

      // Add truncation marker if data was modified
      if (typeof truncated === 'object' && truncated !== null) {
        return {
          ...(truncated as Record<string, unknown>),
          _truncated: true,
          _originalSizeBytes: sizeBytes,
        };
      }

      return truncated;
    } catch (error) {
      // If serialization fails, return a safe placeholder
      return {
        _error: 'Failed to serialize data for size check',
        _message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Simplify data structure to reduce size
   *
   * @remarks
   * Recursively simplifies nested objects and arrays by:
   * - Limiting array lengths
   * - Removing deeply nested objects
   * - Truncating long strings
   *
   * Performance optimizations:
   * - Early returns to avoid unnecessary processing
   * - Reuses limited array instead of mapping twice
   * - Avoids Object.entries() allocation for simple cases
   */
  private simplifyData(data: unknown, maxSizeBytes: number): unknown {
    // Early return for primitives and null/undefined
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      // Early return for small arrays
      if (data.length <= 50) {
        return data.map(item => this.simplifyData(item, maxSizeBytes));
      }

      // Limit array to first 50 items and map in single pass
      const result = data.slice(0, 50).map(item => this.simplifyData(item, maxSizeBytes));
      result.push({ _truncated: `...${data.length - 50} more items` });
      return result;
    }

    // For objects, limit string values and simplify nested structures
    const simplified: Record<string, unknown> = {};
    for (const key in data) {
      // Use for...in with hasOwnProperty check - faster than Object.entries()
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

      const value = (data as Record<string, unknown>)[key];

      if (typeof value === 'string') {
        // Only truncate if necessary
        simplified[key] =
          value.length > 500 ? `${value.substring(0, 500)}...[TRUNCATED]` : value;
      } else if (value && typeof value === 'object') {
        simplified[key] = this.simplifyData(value, maxSizeBytes);
      } else {
        simplified[key] = value;
      }
    }

    return simplified;
  }

  /**
   * Normalize data to be JSONB-compatible
   *
   * @remarks
   * JSONB columns can store objects, arrays, and primitives. However, to maintain
   * type safety and preserve all data types (including strings from non-JSON bodies),
   * we normalize primitives by wrapping them in an object with a special key.
   *
   * @param data - The data to normalize
   * @returns Normalized data that is JSONB-compatible (object, array, or null)
   */
  private normalizeForJsonb(data: unknown): Record<string, unknown> | unknown[] | null {
    if (data === null || data === undefined) {
      return null;
    }

    // Objects and arrays are already JSONB-compatible
    if (typeof data === 'object') {
      return data as Record<string, unknown> | unknown[];
    }

    // Primitives (string, number, boolean) are wrapped in an object to preserve type information
    // This handles cases where requestBody is a string (non-JSON body)
    return { _raw: data };
  }

  // Helper function to handle truncation and sanitization for body and params
  private processBodyAndParams(
    body?: unknown,
    params?: Record<string, string> | undefined,
  ): {
    requestBody: Record<string, unknown> | unknown[] | null;
    requestParams: Record<string, string> | null;
  } {
    // Normalize body first to ensure it's JSONB-compatible
    // This handles the case where body is a string (non-JSON body from audit-trail.ts)
    const normalizedBody = this.normalizeForJsonb(body);

    // Sanitize sensitive data
    const sanitizedRequestBody = normalizedBody
      ? this.sanitizeData(normalizedBody)
      : null;
    const sanitizedRequestParams = params
      ? (this.sanitizeData(params) as Record<string, string> | null)
      : null;

    // Truncate if needed
    const truncatedRequestBody = sanitizedRequestBody
      ? this.truncateIfNeeded(sanitizedRequestBody)
      : null;
    const truncatedRequestParams = sanitizedRequestParams
      ? this.truncateIfNeeded(sanitizedRequestParams)
      : null;

    // Ensure final result is JSONB-compatible (object, array, or null)
    // After normalization, truncatedRequestBody should always be an object, array, or null
    // But we check to be safe in case truncateIfNeeded returns a primitive
    let finalRequestBody: Record<string, unknown> | unknown[] | null = null;
    if (truncatedRequestBody !== null && truncatedRequestBody !== undefined) {
      if (typeof truncatedRequestBody === 'object') {
        finalRequestBody = truncatedRequestBody as Record<string, unknown> | unknown[];
      } else {
        // If truncation somehow returned a primitive, wrap it again
        finalRequestBody = { _raw: truncatedRequestBody };
      }
    }

    return {
      requestBody: finalRequestBody,
      requestParams:
        truncatedRequestParams && typeof truncatedRequestParams === 'object'
          ? (truncatedRequestParams as Record<string, string>)
          : null,
    };
  }

  /**
   * Log an audit trail entry
   *
   * @remarks
   * Errors during audit logging are caught and logged with structured information
   * to enable monitoring and debugging. Failures are tracked internally for metrics.
   * Audit logging failures do not affect the main application flow.
   *
   * **Security:**
   * Request bodies and parameters are automatically sanitized before logging to prevent
   * sensitive data (passwords, tokens, credit cards, etc.) from being stored in audit logs.
   * Sensitive fields are redacted with '[REDACTED]'.
   *
   * **Size Limits:**
   * Request bodies and parameters are truncated to 10KB maximum size to prevent storing
   * excessively large payloads. Truncated data includes markers indicating the original size.
   */
  async logAudit(input: AuditLogInput): Promise<void> {
    try {
      // Use helper function to process body and params
      const { requestBody: sanitizedRequestBody, requestParams: sanitizedRequestParams } =
        this.processBodyAndParams(input.requestBody, input.requestParams);

      const timestampEpochMs = Date.now();
      const auditLogId = randomUUID();
      const createdAtMsKey = formatCreatedAtMsKey(timestampEpochMs);
      const createdAt = new Date(timestampEpochMs).toISOString();

      await AuditLog.put({
        auditLogId,
        createdAtMsKey,
        createdAt,
        userId: input.userId,
        endpoint: input.endpoint,
        timestamp: createdAt,
        timestampEpochMs,
        status: input.status,
        errorMessage: input.errorMessage,
        requestMethod: input.requestMethod,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        ...(sanitizedRequestBody != null ? { requestBody: sanitizedRequestBody } : {}),
        ...(sanitizedRequestParams != null ? { requestParams: sanitizedRequestParams } : {}),
      }).go();
    } catch (error) {
      // Track failure metrics
      this.failureCount++;
      this.lastFailureTime = new Date();

      // Don't throw - audit logging should not break the main flow
      // Log structured error information for monitoring and debugging
      const errorDetails = {
        type: 'AUDIT_LOG_FAILURE',
        error:
          error instanceof Error
            ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
            : String(error),
        input: {
          endpoint: input.endpoint,
          requestMethod: input.requestMethod,
          status: input.status,
          // Don't log sensitive data
          hasRequestBody: !!input.requestBody,
          hasRequestParams: !!input.requestParams,
        },
        metrics: {
          failureCount: this.failureCount,
          lastFailureTime: this.lastFailureTime.toISOString(),
        },
        timestamp: new Date().toISOString(),
      };

      console.error(
        '[AuditLogService] Failed to log audit trail:',
        JSON.stringify(errorDetails, null, 2),
      );

      // Log a summary for quick monitoring
      if (this.failureCount % 10 === 0) {
        console.warn(
          `[AuditLogService] Warning: ${this.failureCount} audit log failures detected. ` +
          `Last failure: ${this.lastFailureTime?.toISOString()}`,
        );
      }
    }
  }

  /**
   * Get audit log failure metrics
   *
   * @returns Object containing failure count and last failure time
   */
  getFailureMetrics(): { failureCount: number; lastFailureTime: Date | null } {
    return {
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  /**
   * Reset failure metrics (useful for testing or manual resets)
   */
  resetFailureMetrics(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  /**
   * Extract booking identifier from request body
   */
  extractBookingIdentifier(body: unknown): string | undefined {
    if (!body || typeof body !== 'object') {
      return undefined;
    }

    const obj = body as Record<string, unknown>;

    // Try booking_id first (webhook format)
    if (obj.booking_id !== undefined) {
      return String(obj.booking_id);
    }

    // Try goodLayerOrderNo (internal format)
    if (obj.goodLayerOrderNo !== undefined) {
      return String(obj.goodLayerOrderNo);
    }

    return undefined;
  }

  /**
   * Extract auth identity from signature header
   */
  extractAuthIdentity(signatureHeader?: string): string | undefined {
    if (!signatureHeader) {
      return undefined;
    }

    // Extract signature hash (first 16 chars for identification)
    const signature = signatureHeader.includes('=')
      ? signatureHeader.split('=')[1]
      : signatureHeader;

    // Return first 16 characters as identifier
    return signature.substring(0, 16);
  }
}

// Export a singleton instance
export const auditLogService = new AuditLogService();
