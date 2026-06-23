import * as v from 'valibot';

import { createTRPCRouter, protectedProcedure } from '@utils/trpc';
import * as queries from '@services/blocked-times/queries';
import * as atomic from '@services/blocked-times/atomic';
import { coerceDate, normalizedString, uuidString } from '@utils/valibot';

const createInputSchema = v.object({
    offeringId: uuidString,
    startsAt: coerceDate,
    endsAt: coerceDate,
    reason: v.optional(v.nullable(v.string())),
});

const updateInputSchema = v.partial(v.omit(createInputSchema, ['offeringId']));

const blockedTimeListInputSchema = v.object({
    offeringId: uuidString,
    page: v.number(),
    pageSize: v.number(),
    sortOrder: v.picklist(['asc', 'desc']),
    filters: v.optional(
        v.object({
            reason: v.optional(normalizedString),
            dateFrom: v.optional(coerceDate),
            dateTo: v.optional(coerceDate),
        }),
    ),
});

export const blockedTimesRouter = createTRPCRouter({
    list: protectedProcedure
        .input(blockedTimeListInputSchema)
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

export type BlockedTimesRouter = typeof blockedTimesRouter;
