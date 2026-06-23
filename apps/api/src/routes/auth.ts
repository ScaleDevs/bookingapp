import { createTRPCRouter, protectedProcedure } from '@utils/trpc';
import * as queries from '@services/organizations/queries';

export const authRouter = createTRPCRouter({
    getOrganization: protectedProcedure
        .query(({ ctx }) => queries.getById(ctx.service)),
});

export type AuthRouter = typeof authRouter;
