---
name: bookingapp-linear-implementation
description: Implement BookingApp work items in small, verifiable architecture-first steps.
---

# Linear → BookingApp implementation

1. Capture the issue identifier, title, and observable acceptance criteria.
2. Read the relevant contract, service, database, and web call site before editing.
3. Map the work to an existing domain folder. New domains belong in `DOMAIN_MANIFEST` (`bookingapp-feature`), not in SST route files.
4. Define or update shared Valibot schemas first when an API shape changes.
5. Implement domain behavior behind the oRPC handler (`queries` / `atomic` / `orchestration`).
6. Update only the Next.js callers required by the contract change.
7. Run `pnpm check-types`, targeted tests, lint, and builds appropriate to the change.
8. Search for obsolete API imports and document any intentional compatibility behavior.

Do not rewrite frontend architecture or alter production infrastructure as part of an unrelated feature.
