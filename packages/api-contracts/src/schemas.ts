import * as v from 'valibot';

export const uuidSchema = v.pipe(v.string(), v.uuid());
export const nullableStringSchema = v.nullable(v.string());

/** Accept the JSON representations used by browsers and normalize them for the API. */
export const coerceDateSchema = v.pipe(
  v.unknown(),
  v.transform((value) => new Date(value as string | number | Date)),
  v.date(),
);

export const dateSchema = v.date();

export const organizationSchema = v.object({
  id: v.string(),
  name: v.string(),
  slug: v.string(),
  logo: nullableStringSchema,
});

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

export const paginationSchema = v.object({
  total: v.number(),
  page: v.number(),
  pageSize: v.number(),
  totalPages: v.number(),
});

export const offeringListSchema = v.object({
  items: v.array(offeringListItemSchema),
  ...paginationSchema.entries,
});

export const offeringScheduleListSchema = v.object({
  items: v.array(offeringScheduleListItemSchema),
  ...paginationSchema.entries,
});

export const blockedTimeListSchema = v.object({
  items: v.array(blockedTimeListItemSchema),
  ...paginationSchema.entries,
});

export const healthSchema = v.object({
  status: v.literal('ok'),
  message: v.string(),
});

export const commonErrors = {
  UNAUTHORIZED: {},
  NOT_FOUND: {},
  CONFLICT: {},
  BAD_REQUEST: {},
  INTERNAL_SERVER_ERROR: {},
} as const;
