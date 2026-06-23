import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { db } from '@db';
import { organization } from '@db/auth-schema';

import { createLogger } from '@utils/logger';
import { BaseService } from '@utils/types';

function createOrganizationLogger(requestId: string | null | undefined, organizationId: string) {
    return createLogger('OrganizationService', {
        requestId: requestId ?? null,
        organizationId,
    });
}

export async function getById({ requestId, organizationId }: BaseService) {
    const logger = createOrganizationLogger(requestId, organizationId);

    try {
        const result = await db.query.organization.findFirst({
            where: eq(organization.id, organizationId),
            columns: {
                id: true,
                name: true,
                slug: true,
                logo: true,
            }
        });

        if (!result) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Organization with id ${organizationId} not found`,
            });
        }

        logger.info('Organization retrieved successfully');

        return result;
    } catch (error) {
        if (error instanceof TRPCError) {
            throw error;
        }

        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to get organization: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}
