import { and, eq } from 'drizzle-orm';

import { db } from '@db';
import { booking, customer, offering } from '@db/schema';
import { ApiError } from '@utils/errors';
import { createLogger } from '@utils/logger';
import { BaseService } from '@utils/types';

import type { BookingCreateInput } from './atomic';

/**
 * Creates a booking after coordinating access to the offering and customer
 * domains. The booking write remains atomic once both related records are
 * confirmed to belong to the active organization.
 */
export async function create(
  { requestId, organizationId }: BaseService,
  input: BookingCreateInput,
) {
  const logger = createLogger('BookingOrchestration', {
    requestId: requestId ?? null,
    organizationId,
  });

  try {
    const [offeringRecord, customerRecord] = await Promise.all([
      db.query.offering.findFirst({
        where: and(
          eq(offering.id, input.offeringId),
          eq(offering.organizationId, organizationId),
        ),
      }),
      db.query.customer.findFirst({
        where: and(
          eq(customer.id, input.customerId),
          eq(customer.organizationId, organizationId),
        ),
      }),
    ]);

    if (!offeringRecord) {
      throw new ApiError({ code: 'NOT_FOUND', message: 'Offering not found' });
    }

    if (!customerRecord) {
      throw new ApiError({ code: 'NOT_FOUND', message: 'Customer not found' });
    }

    const [result] = await db
      .insert(booking)
      .values({
        ...input,
        organizationId,
      })
      .returning();

    logger.info('Booking creation workflow completed successfully');
    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `Failed to create booking: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      cause: error,
    });
  }
}
