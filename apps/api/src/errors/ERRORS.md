# Error Handling Pipeline

BookingApp services throw transport-agnostic `AppError` subclasses from `@errors`. Routers do not catch. oRPC interceptors and the Hono `onError` handler classify, log, and format every failure.

```
Service throws AppError / NotFoundError / ConflictError
  → oRPC procedure (no try/catch)
  → classifyAndLogInterceptor
  → appErrorInterceptor
  → OpenAPI handler
  → standard { code, message, details, requestId, timestamp, path }
```

## Application errors

| Class | HTTP |
| --- | --- |
| `NotFoundError` | 404 |
| `ConflictError` | 409 |
| `BadRequestError` | 400 |
| `ValidationError` | 400 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `UnprocessableError` | 422 |
| `InternalError` | 500 |

Do not add thin wrappers like `OfferingNotFoundError`. Do not throw `ORPCError` from a service. Unexpected database failures are classified by SQLSTATE and never returned as raw driver messages.

Add a domain-specific error only when a business rule cannot be expressed by the classes above.
