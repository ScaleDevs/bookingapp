import * as v from 'valibot';

import { createTRPCRouter, protectedProcedure } from '@utils/trpc';
import * as queries from '@services/offerings/queries';
import * as atomic from '@services/offerings/atomic';
import { normalizedString, uuidString } from '@utils/valibot';

const createInputSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1)),
    description: v.optional(v.nullable(v.string())),
    durationMinutes: v.pipe(v.string(), v.minLength(1)),
    capacity: v.pipe(v.string(), v.minLength(1)),
    isActive: v.optional(v.boolean()),
    price: v.pipe(v.string(), v.minLength(1), v.transform((val) => {
        const num = Number(val);
        if (isNaN(num)) {
            throw new Error('Price must be a valid number');
        }
        return val;
    })),
});

const updateInputSchema = v.partial(createInputSchema);

const offeringListInputSchema = v.object({
    page: v.number(),
    pageSize: v.number(),
    sortOrder: v.picklist(['asc', 'desc']),
    filters: v.optional(
        v.object({
            name: v.optional(normalizedString),
            isActive: v.optional(v.boolean()),
        }),
    ),
});

export const offeringsRouter = createTRPCRouter({
    list: protectedProcedure
        .input(offeringListInputSchema)
        .query(async ({ ctx, input }) => {
            return await queries.list(ctx.service, input);
        }),

    getById: protectedProcedure
        .input(v.object({ id: uuidString }))
        .query(({ ctx, input }) => queries.getById(ctx.service, input.id)),

    getSelectOptions: protectedProcedure
        .query(({ ctx }) => queries.getSelectOptions(ctx.service)),

    create: protectedProcedure
        .input(createInputSchema)
        .mutation(({ ctx, input }) => atomic.create(ctx.service, input)),

    update: protectedProcedure
        .input(v.object({ id: uuidString, data: updateInputSchema }))
        .mutation(({ ctx, input }) => atomic.update(ctx.service, input.id, input.data)),

    delete: protectedProcedure
        .input(v.object({ id: uuidString }))
        .mutation(({ ctx, input }) => atomic.remove(ctx.service, input.id)),

    toggleStatus: protectedProcedure
        .input(v.object({ id: uuidString }))
        .mutation(({ ctx, input }) => atomic.toggleStatus(ctx.service, input.id)),
});

export type OfferingsRouter = typeof offeringsRouter;
