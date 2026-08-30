import { oc } from '@orpc/contract';
import type { Route } from '@orpc/contract';
import * as v from 'valibot';

import {
  blockedTimeSchema,
  blockedTimeListSchema,
  bookingSchema,
  commonErrors,
  customerSchema,
  healthSchema,
  offeringListSchema,
  offeringScheduleListSchema,
  offeringScheduleSchema,
  offeringSchema,
  offeringSelectOptionSchema,
  organizationSchema,
  coerceDateSchema,
  normalizedStringSchema,
  uuidSchema,
} from './schemas';

const openapi = (route: Route): Route => route;
const protectedContract = oc.errors(commonErrors);
const protectedGetContract = protectedContract.input(v.object({}));

const createOfferingInput = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.optional(v.nullable(v.string())),
  durationMinutes: v.pipe(v.string(), v.minLength(1)),
  capacity: v.pipe(v.string(), v.minLength(1)),
  isActive: v.optional(v.boolean()),
  price: v.pipe(
    v.string(),
    v.minLength(1),
    v.check((value) => !Number.isNaN(Number(value)), 'Price must be a valid number'),
  ),
});

const createScheduleInput = v.object({
  offeringId: uuidSchema,
  dayOfWeek: v.pipe(
    v.string(),
    v.length(1),
    v.regex(/^[0-6]$/, 'Must be a digit from 0-6'),
  ),
  startTime: v.pipe(v.string(), v.minLength(1)),
  endTime: v.pipe(v.string(), v.minLength(1)),
  isActive: v.optional(v.boolean()),
});

const listInput = v.object({
  page: v.number(),
  pageSize: v.number(),
  sortOrder: v.picklist(['asc', 'desc']),
});

const idInput = v.object({ id: uuidSchema });

export const contract = {
  health: oc
    .route(openapi({ method: 'GET', path: '/health', tags: ['system'] }))
    .output(healthSchema),

  testProtected: protectedGetContract
    .route(openapi({ method: 'GET', path: '/test-protected', tags: ['system'] }))
    .output(healthSchema),

  auth: {
    getOrganization: protectedGetContract
      .route(openapi({ method: 'GET', path: '/auth/organization', tags: ['auth'] }))
      .output(organizationSchema),
  },

  offerings: {
    list: protectedContract
      .input(
        v.object({
          ...listInput.entries,
          filters: v.optional(
            v.object({
              name: v.optional(normalizedStringSchema),
              isActive: v.optional(v.boolean()),
            }),
          ),
        }),
      )
      .route(openapi({ method: 'GET', path: '/offerings', tags: ['offerings'] }))
      .output(offeringListSchema),
    getById: protectedContract
      .input(idInput)
      .route(openapi({ method: 'GET', path: '/offerings/{id}', tags: ['offerings'] }))
      .output(v.nullable(offeringSchema)),
    getSelectOptions: protectedGetContract
      .route(openapi({ method: 'GET', path: '/offerings/select-options', tags: ['offerings'] }))
      .output(v.array(offeringSelectOptionSchema)),
    create: protectedContract
      .input(createOfferingInput)
      .route(openapi({ method: 'POST', path: '/offerings', tags: ['offerings'] }))
      .output(offeringSchema),
    update: protectedContract
      .input(v.object({ id: uuidSchema, data: v.partial(createOfferingInput) }))
      .route(openapi({ method: 'PATCH', path: '/offerings/{id}', tags: ['offerings'] }))
      .output(offeringSchema),
    delete: protectedContract
      .input(idInput)
      .route(openapi({ method: 'DELETE', path: '/offerings/{id}', tags: ['offerings'] }))
      .output(offeringSchema),
    toggleStatus: protectedContract
      .input(idInput)
      .route(openapi({ method: 'POST', path: '/offerings/{id}/toggle-status', tags: ['offerings'] }))
      .output(offeringSchema),
  },

  offeringSchedules: {
    list: protectedContract
      .input(
        v.object({
          ...listInput.entries,
          offeringId: uuidSchema,
          filters: v.optional(
            v.object({
              dayOfWeek: v.optional(v.number()),
              isActive: v.optional(v.boolean()),
            }),
          ),
        }),
      )
      .route(openapi({ method: 'GET', path: '/offering-schedules', tags: ['offering-schedules'] }))
      .output(offeringScheduleListSchema),
    getById: protectedContract
      .input(idInput)
      .route(openapi({ method: 'GET', path: '/offering-schedules/{id}', tags: ['offering-schedules'] }))
      .output(v.nullable(v.intersect([offeringScheduleSchema, v.object({ offering: offeringSchema })]))),
    create: protectedContract
      .input(createScheduleInput)
      .route(openapi({ method: 'POST', path: '/offering-schedules', tags: ['offering-schedules'] }))
      .output(offeringScheduleSchema),
    update: protectedContract
      .input(v.object({ id: uuidSchema, data: v.partial(v.omit(createScheduleInput, ['offeringId'])) }))
      .route(openapi({ method: 'PATCH', path: '/offering-schedules/{id}', tags: ['offering-schedules'] }))
      .output(offeringScheduleSchema),
    delete: protectedContract
      .input(idInput)
      .route(openapi({ method: 'DELETE', path: '/offering-schedules/{id}', tags: ['offering-schedules'] }))
      .output(offeringScheduleSchema),
  },

  blockedTimes: {
    list: protectedContract
      .input(
        v.object({
          ...listInput.entries,
          offeringId: uuidSchema,
          filters: v.optional(
            v.object({
              reason: v.optional(normalizedStringSchema),
              dateFrom: v.optional(coerceDateSchema),
              dateTo: v.optional(coerceDateSchema),
            }),
          ),
        }),
      )
      .route(openapi({ method: 'GET', path: '/blocked-times', tags: ['blocked-times'] }))
      .output(blockedTimeListSchema),
    getById: protectedContract
      .input(idInput)
      .route(openapi({ method: 'GET', path: '/blocked-times/{id}', tags: ['blocked-times'] }))
      .output(v.nullable(v.intersect([blockedTimeSchema, v.object({ offering: offeringSchema })]))),
    create: protectedContract
      .input(
        v.object({
          offeringId: uuidSchema,
          startsAt: coerceDateSchema,
          endsAt: coerceDateSchema,
          reason: v.optional(v.nullable(v.string())),
        }),
      )
      .route(openapi({ method: 'POST', path: '/blocked-times', tags: ['blocked-times'] }))
      .output(blockedTimeSchema),
    update: protectedContract
      .input(
        v.object({
          id: uuidSchema,
          data: v.partial(
            v.object({
              startsAt: coerceDateSchema,
              endsAt: coerceDateSchema,
              reason: v.optional(v.nullable(v.string())),
            }),
          ),
        }),
      )
      .route(openapi({ method: 'PATCH', path: '/blocked-times/{id}', tags: ['blocked-times'] }))
      .output(blockedTimeSchema),
    delete: protectedContract
      .input(idInput)
      .route(openapi({ method: 'DELETE', path: '/blocked-times/{id}', tags: ['blocked-times'] }))
      .output(blockedTimeSchema),
  },

  customers: {
    list: protectedGetContract
      .route(openapi({ method: 'GET', path: '/customers', tags: ['customers'] }))
      .output(v.array(customerSchema)),
    getById: protectedContract
      .input(idInput)
      .route(openapi({ method: 'GET', path: '/customers/{id}', tags: ['customers'] }))
      .output(v.nullable(customerSchema)),
    create: protectedContract
      .input(
        v.object({
          name: v.pipe(v.string(), v.minLength(1)),
          email: v.optional(v.nullable(v.pipe(v.string(), v.email()))),
          phone: v.optional(v.nullable(v.string())),
          notes: v.optional(v.nullable(v.string())),
        }),
      )
      .route(openapi({ method: 'POST', path: '/customers', tags: ['customers'] }))
      .output(customerSchema),
    update: protectedContract
      .input(
        v.object({
          id: uuidSchema,
          data: v.partial(
            v.object({
              name: v.pipe(v.string(), v.minLength(1)),
              email: v.optional(v.nullable(v.pipe(v.string(), v.email()))),
              phone: v.optional(v.nullable(v.string())),
              notes: v.optional(v.nullable(v.string())),
            }),
          ),
        }),
      )
      .route(openapi({ method: 'PATCH', path: '/customers/{id}', tags: ['customers'] }))
      .output(customerSchema),
    delete: protectedContract
      .input(idInput)
      .route(openapi({ method: 'DELETE', path: '/customers/{id}', tags: ['customers'] }))
      .output(customerSchema),
  },

  bookings: {
    list: protectedGetContract
      .route(openapi({ method: 'GET', path: '/bookings', tags: ['bookings'] }))
      .output(v.array(bookingSchema)),
    getById: protectedContract
      .input(idInput)
      .route(openapi({ method: 'GET', path: '/bookings/{id}', tags: ['bookings'] }))
      .output(v.nullable(bookingSchema)),
    create: protectedContract
      .input(
        v.object({
          offeringId: uuidSchema,
          customerId: uuidSchema,
          startsAt: coerceDateSchema,
          endsAt: coerceDateSchema,
          status: v.optional(v.string()),
          notes: v.optional(v.nullable(v.string())),
        }),
      )
      .route(openapi({ method: 'POST', path: '/bookings', tags: ['bookings'] }))
      .output(bookingSchema),
    update: protectedContract
      .input(
        v.object({
          id: uuidSchema,
          data: v.partial(
            v.object({
              startsAt: coerceDateSchema,
              endsAt: coerceDateSchema,
              status: v.optional(v.string()),
              notes: v.optional(v.nullable(v.string())),
            }),
          ),
        }),
      )
      .route(openapi({ method: 'PATCH', path: '/bookings/{id}', tags: ['bookings'] }))
      .output(bookingSchema),
    delete: protectedContract
      .input(idInput)
      .route(openapi({ method: 'DELETE', path: '/bookings/{id}', tags: ['bookings'] }))
      .output(bookingSchema),
  },
} as const;

export type ApiContract = typeof contract;
export * from './schemas';
