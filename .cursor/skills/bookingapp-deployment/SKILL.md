---
name: bookingapp-deployment
description: Deploy and troubleshoot the BookingApp API and web applications safely with SST.
---

# BookingApp deployment

The API is an SST application in `apps/api` using API Gateway V2, a Lambda handler, and the existing DynamoDB resource alongside PostgreSQL. The web app retains its own existing SST deployment.

- Deploy only the application affected by a change.
- Use the existing `dev`, `production`, and API `local` stages.
- Keep `ROOT_DOMAIN`, certificate ARNs, database URLs, and Better Auth secrets in deployment environment settings.
- Do not copy reference-repository resource names or domains.
- Keep production protection/retention settings intact.
- Validate API contracts and builds before deployment; use `/health` and `/api/openapi.json` for non-secret smoke checks.
