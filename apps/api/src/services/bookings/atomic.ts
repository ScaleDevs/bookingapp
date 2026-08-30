import { eq, and } from 'drizzle-orm';
import { db } from '@db';
import { booking } from '@db/schema';

import { createLogger } from '@utils/logger';
import { ApiError } from '@utils/errors';
import { BaseService } from '@utils/types';

function createBookingLogger(requestId: string | null | undefined, organizationId: string) {
    return createLogger('BookingService', {
        requestId: requestId ?? null,
        organizationId,
    });
}

export type BookingCreateInput = {
    offeringId: string;
    customerId: string;
    startsAt: Date;
    endsAt: Date;
    status?: string;
    notes?: string | null;
};

export type BookingUpdateInput = Partial<Omit<BookingCreateInput, 'offeringId' | 'customerId'>>;

export async function update({ requestId, organizationId }: BaseService, id: string, input: BookingUpdateInput) {
    const logger = createBookingLogger(requestId, organizationId);

    try {
        const [result] = await db.update(booking).set({
            ...input,
            updatedAt: new Date(),
        }).where(and(eq(booking.organizationId, organizationId), eq(booking.id, id))).returning();

        logger.info('Booking updated successfully');

        return result;
    } catch (error) {
        throw new ApiError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function remove({ requestId, organizationId }: BaseService, id: string) {
    const logger = createBookingLogger(requestId, organizationId);

    try {
        const [result] = await db.delete(booking)
            .where(and(eq(booking.organizationId, organizationId), eq(booking.id, id)))
            .returning();

        logger.info('Booking deleted successfully');

        return result;
    } catch (error) {
        throw new ApiError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to delete booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}
