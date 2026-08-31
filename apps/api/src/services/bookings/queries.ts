import { eq, and } from "drizzle-orm";
import { db } from "@db";
import { booking } from "@db/schema";

import { createLogger } from "@utils/logger";
import { BaseService } from "@utils/types";

function createBookingLogger(requestId: string | null | undefined, organizationId: string) {
  return createLogger("BookingService", {
    requestId: requestId ?? null,
    organizationId,
  });
}

export async function list({ requestId, organizationId }: BaseService) {
  const logger = createBookingLogger(requestId, organizationId);

  const result = await db.query.booking.findMany({
    where: eq(booking.organizationId, organizationId),
  });

  logger.info("Bookings listed successfully");

  return result;
}

export async function getById({ requestId, organizationId }: BaseService, id: string) {
  const logger = createBookingLogger(requestId, organizationId);

  const result = await db.query.booking.findFirst({
    where: and(eq(booking.organizationId, organizationId), eq(booking.id, id)),
  });

  logger.info("Booking retrieved successfully");

  return result;
}
