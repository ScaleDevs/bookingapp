import { eq, and, asc, desc, count } from "drizzle-orm";
import { db } from "@db";
import { offering, offeringSchedule } from "@db/schema";

import { createLogger } from "@utils/logger";
import { NotFoundError } from "@errors";
import { BaseService } from "@utils/types";

export interface OfferingScheduleListOptions {
  offeringId: string;
  page: number;
  pageSize: number;
  sortOrder: "asc" | "desc";
  filters?: {
    dayOfWeek?: number;
    isActive?: boolean;
  };
}

function createOfferingScheduleLogger(requestId: string | null | undefined, organizationId: string) {
  return createLogger("OfferingScheduleService", {
    requestId: requestId ?? null,
    organizationId,
  });
}

async function verifyOfferingAccess(organizationId: string, offeringId: string) {
  return db.query.offering.findFirst({
    where: and(eq(offering.id, offeringId), eq(offering.organizationId, organizationId)),
  });
}

export async function list({ requestId, organizationId }: BaseService, options: OfferingScheduleListOptions) {
  const logger = createOfferingScheduleLogger(requestId, organizationId);
  const { offeringId, page, pageSize, sortOrder } = options;
  const offset = (page - 1) * pageSize;

  const offeringRecord = await verifyOfferingAccess(organizationId, offeringId);
  if (!offeringRecord) {
    throw new NotFoundError("Offering not found");
  }

  const conditions = [eq(offeringSchedule.offeringId, offeringId)];

  if (options.filters?.dayOfWeek !== undefined) {
    conditions.push(eq(offeringSchedule.dayOfWeek, options.filters.dayOfWeek.toString()));
  }

  if (options.filters?.isActive !== undefined) {
    conditions.push(eq(offeringSchedule.isActive, options.filters.isActive));
  }

  const where = and(...conditions);
  const orderByClauses =
    sortOrder === "desc"
      ? [desc(offeringSchedule.createdAt), desc(offeringSchedule.id)]
      : [asc(offeringSchedule.createdAt), asc(offeringSchedule.id)];

  const [countRow] = await db.select({ total: count() }).from(offeringSchedule).where(where);
  const total = countRow?.total ?? 0;

  const result = await db.query.offeringSchedule.findMany({
    where,
    orderBy: orderByClauses,
    limit: pageSize,
    offset,
    columns: {
      id: true,
      offeringId: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isActive: true,
      createdAt: true,
    },
  });

  logger.info("Offering schedules listed successfully");

  return {
    items: result,
    total,
    page,
    pageSize,
    totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
  };
}

export async function getById({ requestId, organizationId }: BaseService, id: string) {
  const logger = createOfferingScheduleLogger(requestId, organizationId);

  const result = await db.query.offeringSchedule.findFirst({
    where: eq(offeringSchedule.id, id),
    with: { offering: true },
  });

  if (!result || result.offering.organizationId !== organizationId) {
    return null;
  }

  logger.info("Offering schedule retrieved successfully");

  return result;
}
