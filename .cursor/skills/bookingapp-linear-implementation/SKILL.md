---
name: bookingapp-linear-implementation
description: Implement BookingApp work items in small, verifiable architecture-first steps.
---

# BookingApp implementation loop

1. Read the relevant contract, service, database, and web call site before editing.
2. Define or update shared Valibot schemas first when an API shape changes.
3. Implement domain behavior behind the oRPC handler.
4. Update only the Next.js callers required by the contract change.
5. Run `pnpm check-types`, targeted tests, lint, and builds appropriate to the change.
6. Search for obsolete API imports and document any intentional compatibility behavior.

Do not rewrite frontend architecture or alter production infrastructure as part of an unrelated feature.
