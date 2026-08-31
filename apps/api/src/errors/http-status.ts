import type { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Narrows a numeric HTTP status to Hono's `ContentfulStatusCode`.
 * Falls back to 500 for out-of-range values.
 */
export function toContentfulStatusCode(status: number): ContentfulStatusCode {
  if (Number.isInteger(status) && status >= 100 && status <= 599) {
    return status as ContentfulStatusCode;
  }

  return 500;
}
