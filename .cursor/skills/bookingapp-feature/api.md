# BookingApp API guidance

- Contracts live in `packages/api-contracts`; API-only domain code stays in `apps/api`.
- Hono serves `/health`, Better Auth at `/api/auth/*`, oRPC at `/api/orpc/*`, and the generated OpenAPI document at `/api/openapi.json`.
- Every protected handler must use the shared organization-aware authentication middleware.
- Services receive `BaseService` (`organizationId` and `requestId`) rather than reading request objects or cookies.
- Convert domain `ApiError` values to typed `ORPCError` responses at the oRPC boundary.
