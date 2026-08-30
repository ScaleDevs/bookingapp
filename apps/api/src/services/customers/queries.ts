import { eq, and } from 'drizzle-orm';
import { db } from '@db';
import { customer } from '@db/schema';

import { createLogger } from '@utils/logger';
import { ApiError } from '@utils/errors';
import { BaseService } from '@utils/types';

function createCustomerLogger(requestId: string | null | undefined, organizationId: string) {
    return createLogger('CustomerService', {
        requestId: requestId ?? null,
        organizationId,
    });
}

export async function list({ requestId, organizationId }: BaseService) {
    const logger = createCustomerLogger(requestId, organizationId);

    try {
        const result = await db.query.customer.findMany({
            where: eq(customer.organizationId, organizationId),
        });

        logger.info('Customers listed successfully');

        return result;
    } catch (error) {
        throw new ApiError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to list customers: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function getById({ requestId, organizationId }: BaseService, id: string) {
    const logger = createCustomerLogger(requestId, organizationId);

    try {
        const result = await db.query.customer.findFirst({
            where: and(eq(customer.organizationId, organizationId), eq(customer.id, id)),
        });

        logger.info('Customer retrieved successfully');

        return result;
    } catch (error) {
        throw new ApiError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to get customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}
