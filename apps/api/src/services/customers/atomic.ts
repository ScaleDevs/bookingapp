import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { db } from '@db';
import { customer } from '@db/schema';

import { createLogger } from '@utils/logger';
import { BaseService } from '@utils/types';

function createCustomerLogger(requestId: string | null | undefined, organizationId: string) {
    return createLogger('CustomerService', {
        requestId: requestId ?? null,
        organizationId,
    });
}

export type CustomerCreateInput = {
    name: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
};

export type CustomerUpdateInput = Partial<CustomerCreateInput>;

export async function create({ requestId, organizationId }: BaseService, input: CustomerCreateInput) {
    const logger = createCustomerLogger(requestId, organizationId);

    try {
        const [result] = await db.insert(customer).values({
            ...input,
            organizationId,
        }).returning();

        logger.info('Customer created successfully');

        return result;
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function update({ requestId, organizationId }: BaseService, id: string, input: CustomerUpdateInput) {
    const logger = createCustomerLogger(requestId, organizationId);

    try {
        const [result] = await db.update(customer).set({
            ...input,
            updatedAt: new Date(),
        }).where(and(eq(customer.organizationId, organizationId), eq(customer.id, id))).returning();

        logger.info('Customer updated successfully');

        return result;
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}

export async function remove({ requestId, organizationId }: BaseService, id: string) {
    const logger = createCustomerLogger(requestId, organizationId);

    try {
        const [result] = await db.delete(customer)
            .where(and(eq(customer.organizationId, organizationId), eq(customer.id, id)))
            .returning();

        logger.info('Customer deleted successfully');

        return result;
    } catch (error) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to delete customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}
