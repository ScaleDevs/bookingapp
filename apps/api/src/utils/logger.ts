/**
 * Logger utility for standardized logging across the application
 *
 * Provides context-aware logging functions that prepend a source identifier
 * to all log messages, making it easier to filter and debug in CloudWatch.
 */

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

/** Optional request/org context appended to the source prefix (e.g. from tRPC `ctx`). */
export type LoggerContext = {
  requestId?: string | null;
  organizationId?: string | null;
};

function formatLoggerContextSuffix(context?: LoggerContext): string {
  if (!context) return '';
  const parts: string[] = [];
  if (context.requestId != null && context.requestId !== '') {
    parts.push(`requestId=${context.requestId}`);
  }
  if (context.organizationId != null && context.organizationId !== '') {
    parts.push(`orgId=${context.organizationId}`);
  }
  return parts.length > 0 ? ` [${parts.join(' ')}]` : '';
}

/**
 * Creates a logger instance with a specific context/source prefix
 *
 * @param source - The source identifier (e.g., 'AutoCancelBookings', 'EmailParser')
 * @param context - Optional request id and organization id for correlated logs
 * @returns Logger object with standard console methods
 *
 * @example
 * ```typescript
 * const logger = createLogger('AutoCancelBookings');
 * logger.log('Processing started');
 * // Output: [AutoCancelBookings] Processing started
 *
 * logger.error('Failed to process', error);
 * // Output: [AutoCancelBookings] Failed to process <error details>
 *
 * const scoped = createLogger('ProductService', { requestId: '...', organizationId: '...' });
 * ```
 */
export function createLogger(source: string, context?: LoggerContext) {
  const prefix = `[${source}]${formatLoggerContextSuffix(context)}`;

  return {
    /**
     * Log success messages
     */
    success: (...args: any[]) => {
      console.log('\x1b[32m%s\x1b[0m', prefix, ...args);
    },

    /**
     * Log general information
     */
    log: (...args: any[]) => {
      console.log('\x1b[37m%s\x1b[0m', prefix, ...args);
    },

    /**
     * Log informational messages
     */
    info: (...args: any[]) => {
      console.info('\x1b[36m%s\x1b[0m', prefix, ...args);
    },

    /**
     * Log warning messages
     */
    warn: (...args: any[]) => {
      console.warn('\x1b[33m%s\x1b[0m', prefix, ...args);
    },

    /**
     * Log error messages
     */
    error: (...args: any[]) => {
      console.error('\x1b[31m%s\x1b[0m', prefix, ...args);
    },

    /**
     * Log debug messages
     */
    debug: (...args: any[]) => {
      console.debug('\x1b[35m%s\x1b[0m', prefix, ...args);
    },
  };
}

/**
 * Type definition for logger instance
 */
export type Logger = ReturnType<typeof createLogger>;
