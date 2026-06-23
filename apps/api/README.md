# api

A full-stack application built with SST (Serverless Stack) on AWS, featuring API Gateway, Lambda functions, and Better Auth authentication. This is a template for creating reservation/booking applications.

## Overview

This project uses SST v3 to deploy a serverless application with:

- API Gateway V2 for HTTP APIs
- Lambda functions for backend logic
- Better Auth for authentication
- Custom domain configuration
- CORS support for frontend integration
- SES for email functionality

## Prerequisites

### Required for Deployment

- **Database Account** create a supabase database and apply initial migrations
- **AWS Account**: An active AWS account with appropriate permissions to create resources (API Gateway, Lambda, IAM roles, etc.)
- **Node.js**: v18 or later recommended
- **AWS CLI**: Installed and configured with credentials that have sufficient permissions
- **Registered Domain**: A domain name registered through any domain registrar (e.g., Route 53, Namecheap, GoDaddy)
- **AWS Certificate Manager (ACM)**:
  - SSL/TLS certificate created in ACM for your domain
  - Create 1 Certificate in us-east-1 since we will be using cloudfront
  - Create 1 Certificate in where the apigateway region is.
  - Certificate should cover your API subdomain (e.g., `api.yourdomain.com` or `*.yourdomain.com` for wildcard)
  - Certificate must be validated (DNS or email validation completed)

### Optional

- Domain hosted in Route 53 (simplifies DNS management, but not required)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Services Structure

Services are organized by domain and separated by responsibility.

```txt
services/
    inventory/
        orchestration.ts
        nucleus.ts
        movement.atomic.ts
        balance.atomic.ts
        queries.ts

    invoice/
        orchestration.ts
        atomic.ts
        queries.ts
```

- `orchestration.ts`
  - High-level business workflows that coordinate multiple operations, domains, and transactions.

- `*.atomic.ts`
  - Reusable domain operations and business primitives responsible for focused state mutations and invariant enforcement.

- `queries.ts`
  - Reusable read/query functions responsible for data retrieval without side effects.
- `nucleus.ts`
  - are a more utility type functions that helps atomic or queries

### IMPORTANT CONSIDERATIONS

- This base app intentionally uses a simple availability model and does **not** introduce an `offering_occurrence` or `slot` table.
- Availability is derived from:
  - `offering_schedule`
  - `blocked_time`
  - existing records in `booking`

- Capacity and occupancy should be calculated from bookings rather than persisted in a separate table.
- This keeps the schema generic enough to support appointments, venue reservations, classes, tutoring sessions, rentals, and similar booking use cases.

#### Future Evolution: `offering_occurrence`

Some verticals may benefit from introducing an `offering_occurrence` table as an additional layer between schedules and bookings:

```text
offering
  └── offering_schedule
        └── offering_occurrence
              └── booking
```

Potential benefits:

- Capacity tracking per occurrence
- Attendance management
- Waitlists
- Occurrence-specific cancellation
- Instructor/resource assignment
- Notes and metadata for a specific occurrence
- Faster occupancy queries

A recommended strategy is to create occurrences on demand (lazy creation) when the first booking is made rather than pre-generating future occurrences.

This should only be introduced when a niche requires occurrence-level behavior. The base platform should remain schedule-driven and derive availability directly from schedules, blocks, and bookings.

## Database Seeds

Seed scripts live in `src/seeds/` and insert sample data into the database. Run them from the project root after migrations are applied and `DATABASE_URL` is set in `.env`.

Pass script arguments after `--` so they are forwarded to the underlying command.

### Seed Scripts

- **accounts.ts**
  - Seeds account-related data. _(Currently a placeholder; no seed logic implemented yet)_
  - **Usage:**
    ```bash
    pnpm db:seed
    # or
    npm run db:seed
    ```

- **offerings.ts**
  - Inserts 22 sample offerings for a specified organization.
  - The organization must already exist in the `organization` table.
  - **Argument:** `<organizationId>` (the target organization ID)
  - **Usage:**
    ```bash
    pnpm db:seed:offerings -- <organizationId>
    # or
    npm run db:seed:offerings -- <organizationId>
    ```
    Example:
    ```bash
    pnpm db:seed:offerings -- 8lxlGOL4Bp6m528s65UPnKko9nziEOds
    ```
  - Prints each inserted offering's name and ID after success.
