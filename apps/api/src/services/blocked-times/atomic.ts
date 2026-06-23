import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { db } from '@db';
import { offering, blockedTime } from '@db/schema';

import { createLogger } from '@utils/logger';
import { BaseService } from '@utils/types';

function createBlockedTimeLogger(requestId: string | null | undefined, organizationId: string) {
    return createLogger('BlockedTimeService', {
        requestId: requestId ?? null,
        organizationId,
    });
}

async function verifyOfferingAccess(organizationId: string, offeringId: string) {
    return db.query.offering.findFirst({
        where: and(eq(offering.id, offeringId), eq(offering.organizationId, organizationId)),
    });
}

export type BlockedTimeCreateInput = {
    offeringId: string;
    startsAt: Date;
    endsAt: Date;
    reason?: string | null;
};

export type BlockedTimeUpdateInput = Partial<Omit<BlockedTimeCreateInput, 'offeringId'>>;

export async function create({ requestId, organizationId }: BaseService, input: BlockedTimeCreateInput) {
    const logger = createBlockedTimeLogger(requestId, organizationId);

    try {
        const offeringRecord = await verifyOfferingAccess(organizationId, input.offeringId);
        if (!offeringRecord) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Offering not found' });
        }

        const [result] = await db.insert(blockedTime).values(input).returning();

        logger.info('Blocked time created successfully');

        return result;
    } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create blocked time: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function update({ requestId, organizationId }: BaseService, id: string, input: BlockedTimeUpdateInput) {
    const logger = createBlockedTimeLogger(requestId, organizationId);

    try {
        const existing = await db.query.blockedTime.findFirst({
            where: eq(blockedTime.id, id),
            with: { offering: true },
        });

        if (!existing || existing.offering.organizationId !== organizationId) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Blocked time not found' });
        }

        const [result] = await db.update(blockedTime).set({
            ...input,
            updatedAt: new Date(),
        }).where(eq(blockedTime.id, id)).returning();

        logger.info('Blocked time updated successfully');

        return result;
    } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update blocked time: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function remove({ requestId, organizationId }: BaseService, id: string) {
    const logger = createBlockedTimeLogger(requestId, organizationId);

    try {
        const existing = await db.query.blockedTime.findFirst({
            where: eq(blockedTime.id, id),
            with: { offering: true },
        });

        if (!existing || existing.offering.organizationId !== organizationId) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Blocked time not found' });
        }

        const [result] = await db.delete(blockedTime)
            .where(eq(blockedTime.id, id))
            .returning();

        logger.info('Blocked time deleted successfully');

        return result;
    } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to delete blocked time: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}
