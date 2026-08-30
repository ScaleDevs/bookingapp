import { eq, and } from 'drizzle-orm';
import { db } from '@db';
import { booking, customer, offering } from '@db/schema';

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

export async function create({ requestId, organizationId }: BaseService, input: BookingCreateInput) {
    const logger = createBookingLogger(requestId, organizationId);

    try {
        const [offeringRecord, customerRecord] = await Promise.all([
            db.query.offering.findFirst({
                where: and(eq(offering.id, input.offeringId), eq(offering.organizationId, organizationId)),
            }),
            db.query.customer.findFirst({
                where: and(eq(customer.id, input.customerId), eq(customer.organizationId, organizationId)),
            }),
        ]);

        if (!offeringRecord) {
            throw new ApiError({ code: 'NOT_FOUND', message: 'Offering not found' });
        }

        if (!customerRecord) {
            throw new ApiError({ code: 'NOT_FOUND', message: 'Customer not found' });
        }

        const [result] = await db.insert(booking).values({
            ...input,
            organizationId,
        }).returning();

        logger.info('Booking created successfully');

        return result;
    } catch (error) {
        if (error instanceof ApiError) throw error;

        throw new ApiError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

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
