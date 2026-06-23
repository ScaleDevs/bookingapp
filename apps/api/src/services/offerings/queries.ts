import { eq, and, asc, desc, count, like } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { db } from '@db';
import { offering } from '@db/schema';

import { createLogger } from '@utils/logger';
import { BaseService } from '@utils/types';

export interface OfferingListOptions {
    page: number;
    pageSize: number;
    sortOrder: 'asc' | 'desc';
    filters?: {
        name?: string;
        isActive?: boolean;
    };
}

function createOfferingLogger(requestId: string | null | undefined, organizationId: string) {
    return createLogger('OfferingService', {
        requestId: requestId ?? null,
        organizationId,
    });
}

export async function list({ requestId, organizationId }: BaseService, options: OfferingListOptions) {
    const logger = createOfferingLogger(requestId, organizationId);

    try {
        const { page, pageSize, sortOrder } = options;
        const offset = (page - 1) * pageSize;

        const conditions = [eq(offering.organizationId, organizationId)];

        if (options.filters?.name) {
            conditions.push(like(offering.name, `%${options.filters.name}%`));
        }

        if (options.filters?.isActive !== undefined) {
            conditions.push(eq(offering.isActive, options.filters.isActive));
        }

        const where = and(...conditions);

        const orderByClauses =
            sortOrder === 'desc'
                ? [desc(offering.createdAt), desc(offering.id)]
                : [asc(offering.createdAt), asc(offering.id)];

        const [countRow] = await db.select({ total: count() }).from(offering).where(where);

        const total = countRow?.total ?? 0;

        const result = await db.query.offering.findMany({
            where,
            orderBy: orderByClauses,
            limit: pageSize,
            offset,
            columns: {
                id: true,
                name: true,
                durationMinutes: true,
                capacity: true,
                isActive: true,
                createdAt: true,
            },
        });


        logger.info('Offerings listed successfully');

        return {
            items: result,
            total,
            page,
            pageSize,
            totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
        };
    } catch (error) {
        if (error instanceof TRPCError) {
            throw error;
        }
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to list offerings: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function getById({ requestId, organizationId }: BaseService, id: string) {
    const logger = createOfferingLogger(requestId, organizationId);

    try {
        const result = await db.query.offering.findFirst({
            where: and(eq(offering.organizationId, organizationId), eq(offering.id, id)),
        });

        logger.info('Offering retrieved successfully');

        return result;
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to get offering: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function getSelectOptions({ requestId, organizationId }: BaseService) {
    const logger = createOfferingLogger(requestId, organizationId);

    try {
        const result = await db.query.offering.findMany({
            where: and(eq(offering.organizationId, organizationId), eq(offering.isActive, true)),
            orderBy: [asc(offering.name)],
            columns: {
                id: true,
                name: true,
            },
        });

        logger.info('Offering select options retrieved successfully');

        return result.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to get offering select options: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}
