import * as v from 'valibot';

import { createTRPCRouter, protectedProcedure } from '@utils/trpc';
import * as queries from '@services/offering-schedules/queries';
import * as atomic from '@services/offering-schedules/atomic';
import { uuidString } from '@utils/valibot';

const createInputSchema = v.object({
    offeringId: uuidString,
    dayOfWeek: v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(1),
        v.custom((value: any) => /^[0-6]$/.test(value), 'Must be a digit from 0-6')
    ),
    startTime: v.pipe(v.string(), v.minLength(1)),
    endTime: v.pipe(v.string(), v.minLength(1)),
    isActive: v.optional(v.boolean()),
});

const updateInputSchema = v.partial(v.omit(createInputSchema, ['offeringId']));

const offeringScheduleListInputSchema = v.object({
    offeringId: uuidString,
    page: v.number(),
    pageSize: v.number(),
    sortOrder: v.picklist(['asc', 'desc']),
    filters: v.optional(
        v.object({
            dayOfWeek: v.optional(v.number()),
            isActive: v.optional(v.boolean()),
        }),
    ),
});

export const offeringSchedulesRouter = createTRPCRouter({
    list: protectedProcedure
        .input(offeringScheduleListInputSchema)
        .query(async ({ ctx, input }) => {
            return await queries.list(ctx.service, input);
        }),

    getById: protectedProcedure
        .input(v.object({ id: uuidString }))
        .query(({ ctx, input }) => queries.getById(ctx.service, input.id)),

    create: protectedProcedure
        .input(createInputSchema)
        .mutation(({ ctx, input }) => atomic.create(ctx.service, input)),

    update: protectedProcedure
        .input(v.object({ id: uuidString, data: updateInputSchema }))
        .mutation(({ ctx, input }) => atomic.update(ctx.service, input.id, input.data)),

    delete: protectedProcedure
        .input(v.object({ id: uuidString }))
        .mutation(({ ctx, input }) => atomic.remove(ctx.service, input.id)),
});

export type OfferingSchedulesRouter = typeof offeringSchedulesRouter;
