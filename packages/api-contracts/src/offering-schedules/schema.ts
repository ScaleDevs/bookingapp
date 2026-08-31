import * as v from "valibot";

import { dateSchema, uuidSchema } from "../shared/schema";
import { offeringSchema } from "../offerings/schema";

export const offeringScheduleSchema = v.object({
  id: uuidSchema,
  offeringId: uuidSchema,
  dayOfWeek: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  isActive: v.boolean(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const offeringScheduleListItemSchema = v.object({
  id: uuidSchema,
  offeringId: uuidSchema,
  dayOfWeek: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  isActive: v.boolean(),
  createdAt: dateSchema,
});

export const offeringScheduleDetailSchema = v.intersect([
  offeringScheduleSchema,
  v.object({ offering: offeringSchema }),
]);

export const createOfferingScheduleInputSchema = v.object({
  offeringId: uuidSchema,
  dayOfWeek: v.pipe(
    v.string(),
    v.length(1),
    v.regex(/^[0-6]$/, "Must be a digit from 0-6"),
  ),
  startTime: v.pipe(v.string(), v.minLength(1)),
  endTime: v.pipe(v.string(), v.minLength(1)),
  isActive: v.optional(v.boolean()),
});
