import { implement, ORPCError, type RouterClient } from '@orpc/server';
import type { ApiContract } from '@bookingapp/api-contracts';
import { contract } from '@bookingapp/api-contracts';

import * as bookingAtomic from './services/bookings/atomic';
import * as bookingOrchestration from './services/bookings/orchestration';
import * as bookingQueries from './services/bookings/queries';
import * as customerAtomic from './services/customers/atomic';
import * as customerQueries from './services/customers/queries';
import * as offeringAtomic from './services/offerings/atomic';
import * as offeringQueries from './services/offerings/queries';
import * as scheduleAtomic from './services/offering-schedules/atomic';
import * as scheduleQueries from './services/offering-schedules/queries';
import * as blockedTimeAtomic from './services/blocked-times/atomic';
import * as blockedTimeQueries from './services/blocked-times/queries';
import * as organizationQueries from './services/organizations/queries';
import { ApiError } from './utils/errors';
import { db, type DbType } from './db';
import { auth } from './utils/auth';

export type ApiContext = {
  db: DbType;
  requestId: string | null;
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  service: {
    organizationId: string;
    requestId: string | null;
  };
};

const implementation = implement(contract).$context<ApiContext>();

const requireAuth = implementation.middleware(async ({ context, next }) => {
  if (!context.user || !context.session) {
    throw new ORPCError('UNAUTHORIZED', {
      message: 'You must be logged in to access this resource.',
    });
  }

  if (!context.service.organizationId) {
    throw new ORPCError('UNAUTHORIZED', {
      message: 'You must be logged in to access this resource. Please select an organization.',
    });
  }

  return next({
    context: {
      user: context.user,
      session: context.session,
      service: context.service,
    },
  });
});

const protectedImplementation = implementation.use(requireAuth);

const toORPCError = (error: unknown): unknown => {
  if (error instanceof ApiError) {
    return new ORPCError(error.code, {
      message: error.message,
      cause: error,
    });
  }

  return error;
};

export const router = implementation.router({
  health: implementation.health.handler(() => ({
    status: 'ok',
    message: 'Service is healthy',
  })),

  testProtected: protectedImplementation.testProtected.handler(() => ({
    status: 'ok',
    message: 'Service is healthy',
  })),

  auth: {
    getOrganization: protectedImplementation.auth.getOrganization.handler(({ context }) =>
      organizationQueries.getById(context.service),
    ),
  },

  offerings: {
    list: protectedImplementation.offerings.list.handler(({ context, input }) =>
      offeringQueries.list(context.service, input),
    ),
    getById: protectedImplementation.offerings.getById.handler(({ context, input }) =>
      offeringQueries.getById(context.service, input.id).then((result) => result ?? null),
    ),
    getSelectOptions: protectedImplementation.offerings.getSelectOptions.handler(({ context }) =>
      offeringQueries.getSelectOptions(context.service),
    ),
    create: protectedImplementation.offerings.create.handler(({ context, input }) =>
      offeringAtomic.create(context.service, input),
    ),
    update: protectedImplementation.offerings.update.handler(({ context, input }) =>
      offeringAtomic.update(context.service, input.id, input.data),
    ),
    delete: protectedImplementation.offerings.delete.handler(({ context, input }) =>
      offeringAtomic.remove(context.service, input.id),
    ),
    toggleStatus: protectedImplementation.offerings.toggleStatus.handler(({ context, input }) =>
      offeringAtomic.toggleStatus(context.service, input.id),
    ),
  },

  offeringSchedules: {
    list: protectedImplementation.offeringSchedules.list.handler(({ context, input }) =>
      scheduleQueries.list(context.service, input),
    ),
    getById: protectedImplementation.offeringSchedules.getById.handler(({ context, input }) =>
      scheduleQueries.getById(context.service, input.id),
    ),
    create: protectedImplementation.offeringSchedules.create.handler(({ context, input }) =>
      scheduleAtomic.create(context.service, input),
    ),
    update: protectedImplementation.offeringSchedules.update.handler(({ context, input }) =>
      scheduleAtomic.update(context.service, input.id, input.data),
    ),
    delete: protectedImplementation.offeringSchedules.delete.handler(({ context, input }) =>
      scheduleAtomic.remove(context.service, input.id),
    ),
  },

  blockedTimes: {
    list: protectedImplementation.blockedTimes.list.handler(({ context, input }) =>
      blockedTimeQueries.list(context.service, input),
    ),
    getById: protectedImplementation.blockedTimes.getById.handler(({ context, input }) =>
      blockedTimeQueries.getById(context.service, input.id).then((result) => result ?? null),
    ),
    create: protectedImplementation.blockedTimes.create.handler(({ context, input }) =>
      blockedTimeAtomic.create(context.service, input),
    ),
    update: protectedImplementation.blockedTimes.update.handler(({ context, input }) =>
      blockedTimeAtomic.update(context.service, input.id, input.data),
    ),
    delete: protectedImplementation.blockedTimes.delete.handler(({ context, input }) =>
      blockedTimeAtomic.remove(context.service, input.id),
    ),
  },

  customers: {
    list: protectedImplementation.customers.list.handler(({ context }) =>
      customerQueries.list(context.service),
    ),
    getById: protectedImplementation.customers.getById.handler(({ context, input }) =>
      customerQueries.getById(context.service, input.id).then((result) => result ?? null),
    ),
    create: protectedImplementation.customers.create.handler(({ context, input }) =>
      customerAtomic.create(context.service, input),
    ),
    update: protectedImplementation.customers.update.handler(({ context, input }) =>
      customerAtomic.update(context.service, input.id, input.data),
    ),
    delete: protectedImplementation.customers.delete.handler(({ context, input }) =>
      customerAtomic.remove(context.service, input.id),
    ),
  },

  bookings: {
    list: protectedImplementation.bookings.list.handler(({ context }) =>
      bookingQueries.list(context.service),
    ),
    getById: protectedImplementation.bookings.getById.handler(({ context, input }) =>
      bookingQueries.getById(context.service, input.id).then((result) => result ?? null),
    ),
    create: protectedImplementation.bookings.create.handler(({ context, input }) =>
      bookingOrchestration.create(context.service, input),
    ),
    update: protectedImplementation.bookings.update.handler(({ context, input }) =>
      bookingAtomic.update(context.service, input.id, input.data),
    ),
    delete: protectedImplementation.bookings.delete.handler(({ context, input }) =>
      bookingAtomic.remove(context.service, input.id),
    ),
  },
});

export type AppRouter = typeof router;
export type AppContract = ApiContract;
export type AppRouterClient = RouterClient<AppRouter>;
export { toORPCError };
