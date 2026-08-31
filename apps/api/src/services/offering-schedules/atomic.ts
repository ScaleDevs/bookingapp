import { eq, and } from "drizzle-orm";
import { db } from "@db";
import { offering, offeringSchedule } from "@db/schema";

import { createLogger } from "@utils/logger";
import { ConflictError, NotFoundError } from "@errors";
import { BaseService } from "@utils/types";

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

export type OfferingScheduleCreateInput = {
  offeringId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
};

export type OfferingScheduleUpdateInput = Partial<Omit<OfferingScheduleCreateInput, "offeringId">>;

export async function create({ requestId, organizationId }: BaseService, input: OfferingScheduleCreateInput) {
  const logger = createOfferingScheduleLogger(requestId, organizationId);

  const offeringRecord = await verifyOfferingAccess(organizationId, input.offeringId);
  if (!offeringRecord) {
    throw new NotFoundError("Offering not found");
  }

  const existingSchedule = await db.query.offeringSchedule.findFirst({
    where: and(
      eq(offeringSchedule.offeringId, input.offeringId),
      eq(offeringSchedule.dayOfWeek, input.dayOfWeek),
      eq(offeringSchedule.startTime, input.startTime),
      eq(offeringSchedule.endTime, input.endTime),
    ),
  });

  if (existingSchedule) {
    throw new ConflictError(
      "A schedule with the same day of week, start time, and end time already exists for this offering",
    );
  }

  const [result] = await db.insert(offeringSchedule).values(input).returning();

  logger.info("Offering schedule created successfully");

  return result;
}

export async function update({ requestId, organizationId }: BaseService, id: string, input: OfferingScheduleUpdateInput) {
  const logger = createOfferingScheduleLogger(requestId, organizationId);

  const existing = await db.query.offeringSchedule.findFirst({
    where: eq(offeringSchedule.id, id),
    with: { offering: true },
  });

  if (!existing || existing.offering.organizationId !== organizationId) {
    throw new NotFoundError("Offering schedule not found");
  }

  const [result] = await db.update(offeringSchedule).set({
    ...input,
    updatedAt: new Date(),
  }).where(eq(offeringSchedule.id, id)).returning();

  logger.info("Offering schedule updated successfully");

  return result;
}

export async function remove({ requestId, organizationId }: BaseService, id: string) {
  const logger = createOfferingScheduleLogger(requestId, organizationId);

  const existing = await db.query.offeringSchedule.findFirst({
    where: eq(offeringSchedule.id, id),
    with: { offering: true },
  });

  if (!existing || existing.offering.organizationId !== organizationId) {
    throw new NotFoundError("Offering schedule not found");
  }

  const [result] = await db.delete(offeringSchedule)
    .where(eq(offeringSchedule.id, id))
    .returning();

  logger.info("Offering schedule deleted successfully");

  return result;
}
