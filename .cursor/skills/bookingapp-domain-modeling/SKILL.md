---
name: bookingapp-domain-modeling
description: Model BookingApp domain behavior without leaking business logic into API handlers.
---

# BookingApp domain modeling

Use the domain-service boundary `API contract → router handler → service → database`.

- `queries.ts` contains side-effect-free reads.
- `atomic.ts` contains one focused write and its local invariant checks.
- `orchestration.ts` is reserved for workflows coordinating multiple domains, such as creating a booking after validating its offering and customer.
- Keep offerings, schedules, blocked times, bookings, customers, and organizations as BookingApp concepts.
- Preserve current booking status, pricing, capacity, schedule, and organization authorization rules.
- Throw `@errors` application errors from services. Routers do not catch. The oRPC interceptor pipeline formats HTTP responses.
