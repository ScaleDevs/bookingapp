import { eq } from "drizzle-orm";
import { db } from "@db";
import { organization } from "@db/auth-schema";

import { createLogger } from "@utils/logger";
import { NotFoundError } from "@errors";
import { BaseService } from "@utils/types";

function createOrganizationLogger(requestId: string | null | undefined, organizationId: string) {
  return createLogger("OrganizationService", {
    requestId: requestId ?? null,
    organizationId,
  });
}

export async function getById({ requestId, organizationId }: BaseService) {
  const logger = createOrganizationLogger(requestId, organizationId);

  const result = await db.query.organization.findFirst({
    where: eq(organization.id, organizationId),
    columns: {
      id: true,
      name: true,
      slug: true,
      logo: true,
    },
  });

  if (!result) {
    throw new NotFoundError(`Organization with id ${organizationId} not found`);
  }

  logger.info("Organization retrieved successfully");

  return result;
}
