import { eq, and } from "drizzle-orm";
import { db } from "@db";
import { customer } from "@db/schema";

import { createLogger } from "@utils/logger";
import { BaseService } from "@utils/types";

function createCustomerLogger(requestId: string | null | undefined, organizationId: string) {
  return createLogger("CustomerService", {
    requestId: requestId ?? null,
    organizationId,
  });
}

export async function list({ requestId, organizationId }: BaseService) {
  const logger = createCustomerLogger(requestId, organizationId);

  const result = await db.query.customer.findMany({
    where: eq(customer.organizationId, organizationId),
  });

  logger.info("Customers listed successfully");

  return result;
}

export async function getById({ requestId, organizationId }: BaseService, id: string) {
  const logger = createCustomerLogger(requestId, organizationId);

  const result = await db.query.customer.findFirst({
    where: and(eq(customer.organizationId, organizationId), eq(customer.id, id)),
  });

  logger.info("Customer retrieved successfully");

  return result;
}
