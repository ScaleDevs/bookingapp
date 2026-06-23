# BookingApp

A pnpm + Turborepo monorepo for a sports club booking platform. It contains a Next.js frontend and a Hono API backend, deployed independently to AWS with [SST](https://sst.dev/).

## Repository structure

```
bookingapp/
├── apps/
│   ├── web/          # Next.js frontend (package name: `web`)
│   └── api/          # Hono + tRPC backend (package name: `api`)
├── packages/
│   ├── eslint-config/       # Shared ESLint configs (@repo/eslint-config)
│   └── typescript-config/   # Shared TypeScript configs (@repo/typescript-config)
└── .github/workflows/       # CI deploy workflows
```

## Apps

### `web` — Frontend

Location: `apps/web`

|                  |                                         |
| ---------------- | --------------------------------------- |
| **Stack**        | Next.js, React, Tailwind CSS, shadcn/ui |
| **State & data** | Zustand, TanStack Query, tRPC client    |
| **Auth**         | better-auth                             |
| **Deploy**       | SST (`sst.aws.Nextjs`) to AWS           |

The frontend talks to the API over tRPC with end-to-end types imported from `apps/api/src/router`.

Local dev runs on port **5173**.

### `api` — Backend

Location: `apps/api`

|               |                                                        |
| ------------- | ------------------------------------------------------ |
| **Stack**     | Hono, tRPC, Drizzle ORM                                |
| **Databases** | PostgreSQL (relational data), DynamoDB (via ElectroDB) |
| **Auth**      | better-auth                                            |
| **Deploy**    | SST (Lambda + API Gateway) to AWS                      |

Domain areas include organizations, offerings, schedules, bookings, customers, and blocked times.

## Shared packages

- **`@repo/eslint-config`** — ESLint presets used across apps
- **`@repo/typescript-config`** — Base `tsconfig` presets

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18 (20 recommended)
- [pnpm](https://pnpm.io/) 9 (`corepack enable` or install globally)
- AWS credentials for deployments
- PostgreSQL for local API development

## Getting started

Install dependencies from the repo root:

```sh
pnpm install
```

Run both apps in development:

```sh
pnpm dev
```

Run a single app:

```sh
pnpm --filter web dev
pnpm --filter api dev
```

Other root scripts:

```sh
pnpm build          # Build all apps via Turborepo
pnpm lint           # Lint all apps
pnpm check-types    # Type-check all apps
pnpm format         # Format with Prettier
```

## App-specific commands

Run these from the repo root using pnpm filters.

### Web

```sh
pnpm --filter web run deploy:dev
pnpm --filter web run deploy:production
pnpm --filter web run remove:dev
pnpm --filter web run remove:production
```

### API

```sh
pnpm --filter api run db:migrate
pnpm --filter api run db:seed
pnpm --filter api run deploy:dev
pnpm --filter api run deploy:production
pnpm --filter api run remove:dev
pnpm --filter api run remove:production
```

See `apps/api/.env.examples` for required environment variables. Copy it to `apps/api/.env` for local development.

## Deployment

Each app has its own SST config and is deployed separately:

| App   | SST app name    | Config                   |
| ----- | --------------- | ------------------------ |
| `web` | `sportsclub-fe` | `apps/web/sst.config.ts` |
| `api` | `sportsclub-be` | `apps/api/sst.config.ts` |

### GitHub Actions

| Workflow         | Triggers on                        | Deploys                                  |
| ---------------- | ---------------------------------- | ---------------------------------------- |
| `deploy-web.yml` | Push to `main` under `apps/web/**` | `web` → dev                              |
| `deploy-api.yml` | Push to `main` under `apps/api/**` | `api` → dev (includes DB migrate + seed) |

Both workflows can also be triggered manually via **workflow_dispatch**, with a choice of **dev** or **production**.

Pushes to `main` auto-deploy to the **dev** stage. Production deploys are manual only.

### Required deploy environment variables

**Web**

- `ROOT_DOMAIN`
- `ACM_CERTIFICATE_ARN` (must be in `us-east-1`)

**API**

- `ROOT_DOMAIN`
- `ACM_CERTIFICATE_ARN`
- `DATABASE_URL`
- `DATABASE_URL_MIGRATIONS`
- `BETTER_AUTH_SECRET`

These are configured as GitHub Actions secrets/variables per environment (`dev`, `production`).

## How the apps connect

```
┌─────────────┐     tRPC (typed)      ┌─────────────┐
│  apps/web   │ ────────────────────► │  apps/api   │
│  (Next.js)  │                       │   (Hono)    │
└─────────────┘                       └──────┬──────┘
                                             │
                                    ┌────────┴────────┐
                                    │                 │
                               PostgreSQL          DynamoDB
```

At deploy time, SST sets `NEXT_PUBLIC_BASE_API_URL` on the frontend to point at the API subdomain for the target stage (e.g. `api-dev.example.com` or `api.example.com` in production).

## Turborepo

Task orchestration is defined in `turbo.json`. Turborepo caches build outputs and runs tasks in the correct dependency order across the workspace.

Filter tasks to a single app:

```sh
pnpm exec turbo build --filter=web
pnpm exec turbo dev --filter=api
```

## Further reading

- [apps/web/README.md](./apps/web/README.md) — Frontend details
- [Turborepo docs](https://turborepo.dev/docs)
- [SST docs](https://sst.dev/docs)
