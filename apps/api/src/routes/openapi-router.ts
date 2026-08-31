import type { AnyRouter } from "@orpc/server";

import { offeringRouter } from "./offering/router";
import { offeringScheduleRouter } from "./offeringSchedule/router";
import { blockedTimeRouter } from "./blockedTime/router";
import { customerRouter } from "./customer/router";
import { bookingRouter } from "./booking/router";
import { organizationRouter } from "./organization/router";
import { systemRouter } from "./system/router";

/**
 * Combined oRPC router used for OpenAPI spec generation.
 * Add each new domain's implemented router here as domains are migrated.
 */
export const openapiRouter = {
  offerings: offeringRouter,
  offeringSchedules: offeringScheduleRouter,
  blockedTimes: blockedTimeRouter,
  customers: customerRouter,
  bookings: bookingRouter,
  organizations: organizationRouter,
  system: systemRouter,
} satisfies Record<string, AnyRouter>;
