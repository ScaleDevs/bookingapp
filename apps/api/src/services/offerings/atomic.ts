import { eq, and } from "drizzle-orm";
import { db } from "@db";
import { offering } from "@db/schema";

import { createLogger } from "@utils/logger";
import { NotFoundError } from "@errors";
import { BaseService } from "@utils/types";

function createOfferingLogger(requestId: string | null | undefined, organizationId: string) {
  return createLogger("OfferingService", {
    requestId: requestId ?? null,
    organizationId,
  });
}

export type OfferingCreateInput = {
  name: string;
  description?: string | null;
  durationMinutes: string;
  capacity: string;
  price: string;
  isActive?: boolean;
};

export type OfferingUpdateInput = Partial<OfferingCreateInput>;

export async function create({ requestId, organizationId }: BaseService, input: OfferingCreateInput) {
  const logger = createOfferingLogger(requestId, organizationId);

  const [result] = await db.insert(offering).values({
    ...input,
    currency: "PHP",
    organizationId,
  }).returning();

  logger.info("Offering created successfully");

  return result;
}

export async function update({ requestId, organizationId }: BaseService, id: string, input: OfferingUpdateInput) {
  const logger = createOfferingLogger(requestId, organizationId);

  const [result] = await db.update(offering).set({
    ...input,
    updatedAt: new Date(),
  }).where(and(eq(offering.organizationId, organizationId), eq(offering.id, id))).returning();

  logger.info("Offering updated successfully");

  return result;
}

export async function remove({ requestId, organizationId }: BaseService, id: string) {
  const logger = createOfferingLogger(requestId, organizationId);

  const [result] = await db.delete(offering)
    .where(and(eq(offering.organizationId, organizationId), eq(offering.id, id)))
    .returning();

  logger.info("Offering deleted successfully");

  return result;
}

export async function toggleStatus({ requestId, organizationId }: BaseService, id: string) {
  const logger = createOfferingLogger(requestId, organizationId);

  const [existingOffering] = await db.select()
    .from(offering)
    .where(and(eq(offering.organizationId, organizationId), eq(offering.id, id)))
    .limit(1);

  if (!existingOffering) {
    throw new NotFoundError("Offering not found");
  }

  const [result] = await db.update(offering).set({
    isActive: !existingOffering.isActive,
    updatedAt: new Date(),
  }).where(and(eq(offering.organizationId, organizationId), eq(offering.id, id))).returning();

  logger.info("Offering status toggled successfully");

  return result;
}
