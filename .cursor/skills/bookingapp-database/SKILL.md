---
name: bookingapp-database
description: Work safely with BookingApp PostgreSQL, Drizzle schema, migrations, and organization scoping.
---

# BookingApp database

BookingApp uses PostgreSQL through Drizzle ORM. The schema is in `apps/api/src/db`, with application tables for offerings, offering schedules, blocked times, customers, and bookings plus Better Auth tables.

- Keep organization scoping in every organization-owned read and mutation.
- Derive availability from schedules, blocked times, and bookings; do not introduce occurrence or slot tables without a product requirement.
- Put schema changes in Drizzle migrations and inspect generated SQL before applying it.
- Keep API contract schemas aligned with the wire-facing shape, including numeric strings and serialized date values.
- Use the existing migration and seed scripts; do not expose database URLs in source, logs, skills, or pull requests.
