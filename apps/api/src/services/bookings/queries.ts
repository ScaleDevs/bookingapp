import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { db } from '@db';
import { booking } from '@db/schema';

import { createLogger } from '@utils/logger';
import { BaseService } from '@utils/types';

function createBookingLogger(requestId: string | null | undefined, organizationId: string) {
    return createLogger('BookingService', {
        requestId: requestId ?? null,
        organizationId,
    });
}

export async function list({ requestId, organizationId }: BaseService) {
    const logger = createBookingLogger(requestId, organizationId);

    try {
        const result = await db.query.booking.findMany({
            where: eq(booking.organizationId, organizationId),
        });

        logger.info('Bookings listed successfully');

        return result;
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to list bookings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function getById({ requestId, organizationId }: BaseService, id: string) {
    const logger = createBookingLogger(requestId, organizationId);

    try {
        const result = await db.query.booking.findFirst({
            where: and(eq(booking.organizationId, organizationId), eq(booking.id, id)),
        });

        logger.info('Booking retrieved successfully');

        return result;
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to get booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}
