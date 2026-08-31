import * as v from "valibot";

import { dateSchema, nullableStringSchema, uuidSchema } from "../shared/schema";

export const customerSchema = v.object({
  id: uuidSchema,
  organizationId: v.string(),
  name: v.string(),
  email: nullableStringSchema,
  phone: nullableStringSchema,
  notes: nullableStringSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createCustomerInputSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  email: v.optional(v.nullable(v.pipe(v.string(), v.email()))),
  phone: v.optional(v.nullable(v.string())),
  notes: v.optional(v.nullable(v.string())),
});
