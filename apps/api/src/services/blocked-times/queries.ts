import { eq, and, like, count, desc, asc, gte, lte } from "drizzle-orm";
import { db } from "@db";
import { offering, blockedTime } from "@db/schema";

import { createLogger } from "@utils/logger";
import { NotFoundError } from "@errors";
import { BaseService } from "@utils/types";

type BlockedTimeListOptions = {
  offeringId: string;
  page: number;
  pageSize: number;
  sortOrder: "asc" | "desc";
  filters?: {
    reason?: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
};

function createBlockedTimeLogger(requestId: string | null | undefined, organizationId: string) {
  return createLogger("BlockedTimeService", {
    requestId: requestId ?? null,
    organizationId,
  });
}

async function verifyOfferingAccess(organizationId: string, offeringId: string) {
  return db.query.offering.findFirst({
    where: and(eq(offering.id, offeringId), eq(offering.organizationId, organizationId)),
  });
}

export async function list({ requestId, organizationId }: BaseService, options: BlockedTimeListOptions) {
  const logger = createBlockedTimeLogger(requestId, organizationId);
  const { offeringId, page, pageSize, sortOrder } = options;
  const offset = (page - 1) * pageSize;

  const offeringRecord = await verifyOfferingAccess(organizationId, offeringId);
  if (!offeringRecord) {
    throw new NotFoundError("Offering not found");
  }

  const conditions = [eq(blockedTime.offeringId, offeringId)];

  if (options.filters?.reason) {
    conditions.push(like(blockedTime.reason, `%${options.filters.reason}%`));
  }

  if (options.filters?.dateFrom) {
    conditions.push(gte(blockedTime.startsAt, options.filters.dateFrom));
  }

  if (options.filters?.dateTo) {
    conditions.push(lte(blockedTime.endsAt, options.filters.dateTo));
  }

  const where = and(...conditions);
  const orderByClauses =
    sortOrder === "desc"
      ? [desc(blockedTime.startsAt), desc(blockedTime.id)]
      : [asc(blockedTime.startsAt), asc(blockedTime.id)];

  const [countRow] = await db.select({ total: count() }).from(blockedTime).where(where);
  const total = countRow?.total ?? 0;

  const result = await db.query.blockedTime.findMany({
    where,
    orderBy: orderByClauses,
    limit: pageSize,
    offset,
    columns: {
      id: true,
      offeringId: true,
      startsAt: true,
      endsAt: true,
      reason: true,
      createdAt: true,
    },
  });

  logger.info("Blocked times listed successfully");

  return {
    items: result,
    total,
    page,
    pageSize,
    totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
  };
}

export async function getById({ requestId, organizationId }: BaseService, id: string) {
  const logger = createBlockedTimeLogger(requestId, organizationId);

  const result = await db.query.blockedTime.findFirst({
    where: eq(blockedTime.id, id),
    with: { offering: true },
  });

  if (!result || result.offering.organizationId !== organizationId) {
    return null;
  }

  logger.info("Blocked time retrieved successfully");

  return result;
}
