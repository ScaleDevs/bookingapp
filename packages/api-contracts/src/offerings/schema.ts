import * as v from "valibot";

import { dateSchema, nullableStringSchema, uuidSchema } from "../shared/schema";

export const offeringSchema = v.object({
  id: uuidSchema,
  organizationId: v.string(),
  price: v.string(),
  currency: v.string(),
  name: v.string(),
  description: nullableStringSchema,
  durationMinutes: v.string(),
  capacity: v.string(),
  isActive: v.boolean(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const offeringListItemSchema = v.object({
  id: uuidSchema,
  name: v.string(),
  durationMinutes: v.string(),
  capacity: v.string(),
  isActive: v.boolean(),
  createdAt: dateSchema,
});

export const offeringSelectOptionSchema = v.object({
  label: v.string(),
  value: uuidSchema,
});

export const createOfferingInputSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.optional(v.nullable(v.string())),
  durationMinutes: v.pipe(v.string(), v.minLength(1)),
  capacity: v.pipe(v.string(), v.minLength(1)),
  isActive: v.optional(v.boolean()),
  price: v.pipe(
    v.string(),
    v.minLength(1),
    v.check((value) => !Number.isNaN(Number(value)), "Price must be a valid number"),
  ),
});
