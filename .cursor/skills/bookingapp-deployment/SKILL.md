---
name: bookingapp-deployment
description: Deploy and troubleshoot the BookingApp API and web applications safely with SST.
---

# BookingApp deployment

Be conservative. Do not casually edit production resources, secrets, database URLs, domain config, SST infra, or deploy workflows. Feature work almost never needs those files — add a domain via `DOMAIN_MANIFEST` (`bookingapp-feature`), not by hand-editing API Gateway routes.

The API is an SST application in `apps/api`. The web app retains its own Next.js SST deployment.

## SST apps and stages

| Package | SST `app.name` | Config |
| --- | --- | --- |
| `api` | `api` | `apps/api/sst.config.ts` |
| `web` | `web` | `apps/web/sst.config.ts` |

Production: `protect: true` and `removal: "retain"`. Other stages: `removal: "remove"`.

| Stage | API | Web |
| --- | --- | --- |
| `local` | `pnpm --filter api deploy:local` — Dynamo table only, no API Gateway | no script |
| `dev` | full API + one Lambda per domain | CloudFront `<stage>.<ROOT_DOMAIN>` |
| `production` | full API | `<ROOT_DOMAIN>` |

Local day-to-day is **not** an SST stage: `pnpm --filter api dev` + `pnpm --filter web dev` (Next.js `:5173`, `/api` → `localhost:3000`).

## Domains

Keep `ROOT_DOMAIN`, certificate ARNs, database URLs, and Better Auth secrets in deployment environment settings. Do not copy reference-repository resource names or domains.

| Surface | production | other stages |
| --- | --- | --- |
| API | `api.<ROOT_DOMAIN>` | `api-<stage>.<ROOT_DOMAIN>` |
| Web | `<ROOT_DOMAIN>` | `<stage>.<ROOT_DOMAIN>` |

## Infra conventions

New API domain: add `DOMAIN_MANIFEST` + `routes/<name>/lambda.ts`. `apps/api/infra/domains.ts` emits `ANY ${basePath}` and `ANY ${basePath}/{proxy+}` → `src/routes/${name}/lambda.handler`. **Do not edit `domains.ts` or the route loop in `infra/api.ts`.**

Hands-off unless the task is explicitly infra: storage, lambda policies, shared-config domains/CORS, workflow secret/stage names.

Validate contracts and builds before deployment. Local smoke checks: `GET /health`, `GET /openapi.json`. After a **dev** deploy, confirm SST outputs / stage URL. Do not run `sst remove` on production.
