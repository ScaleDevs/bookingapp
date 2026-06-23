import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { baseProcedure, createTRPCRouter, protectedProcedure } from './utils/trpc'

import { authRouter } from './routes/auth';
import { bookingsRouter } from './routes/bookings';
import { offeringsRouter } from './routes/offerings';
import { offeringSchedulesRouter } from './routes/offering-schedules';
import { blockedTimesRouter } from './routes/blocked-times';
import { customersRouter } from './routes/customers';

export const appRouter = createTRPCRouter({
    health: baseProcedure.query(() => {
        return {
            status: 'ok',
            message: 'Service is healthy',
        };
    }),

    testProtected: protectedProcedure.query(() => {
        return {
            status: 'ok',
            message: 'Service is healthy',
        };
    }),
    


    // ****************************** //
    // ****** CORE ROUTES ********** //
    // ****************************** //
    auth: authRouter,
    offerings: offeringsRouter,
    offeringSchedules: offeringSchedulesRouter,
    blockedTimes: blockedTimesRouter,
    customers: customersRouter,
    bookings: bookingsRouter,
});

export type AppRouter = typeof appRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
