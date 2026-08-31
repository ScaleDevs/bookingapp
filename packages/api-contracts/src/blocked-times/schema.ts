import * as v from "valibot";

import { dateSchema, nullableStringSchema, uuidSchema } from "../shared/schema";
import { offeringSchema } from "../offerings/schema";

export const blockedTimeSchema = v.object({
  id: uuidSchema,
  offeringId: uuidSchema,
  startsAt: dateSchema,
  endsAt: dateSchema,
  reason: nullableStringSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const blockedTimeListItemSchema = v.object({
  id: uuidSchema,
  offeringId: uuidSchema,
  startsAt: dateSchema,
  endsAt: dateSchema,
  reason: nullableStringSchema,
  createdAt: dateSchema,
});

export const blockedTimeDetailSchema = v.intersect([
  blockedTimeSchema,
  v.object({ offering: offeringSchema }),
]);

export const createBlockedTimeInputSchema = v.object({
  offeringId: uuidSchema,
  startsAt: v.date(),
  endsAt: v.date(),
  reason: v.optional(v.nullable(v.string())),
});
