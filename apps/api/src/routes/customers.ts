import * as v from 'valibot';

import { createTRPCRouter, protectedProcedure } from '@utils/trpc';
import * as queries from '@services/customers/queries';
import * as atomic from '@services/customers/atomic';
import { uuidString } from '@utils/valibot';

const createInputSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1)),
    email: v.optional(v.nullable(v.pipe(v.string(), v.email()))),
    phone: v.optional(v.nullable(v.string())),
    notes: v.optional(v.nullable(v.string())),
});

const updateInputSchema = v.partial(createInputSchema);

export const customersRouter = createTRPCRouter({
    list: protectedProcedure.query(({ ctx }) => queries.list(ctx.service)),

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

export type CustomersRouter = typeof customersRouter;
