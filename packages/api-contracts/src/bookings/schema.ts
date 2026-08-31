import * as v from "valibot";

import { dateSchema, nullableStringSchema, uuidSchema } from "../shared/schema";

export const bookingSchema = v.object({
  id: uuidSchema,
  organizationId: v.string(),
  offeringId: uuidSchema,
  customerId: uuidSchema,
  startsAt: dateSchema,
  endsAt: dateSchema,
  status: v.string(),
  notes: nullableStringSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createBookingInputSchema = v.object({
  offeringId: uuidSchema,
  customerId: uuidSchema,
  startsAt: v.date(),
  endsAt: v.date(),
  status: v.optional(v.string()),
  notes: v.optional(v.nullable(v.string())),
});
