import type { DomainDefinition } from "../architecture/domain";
import { authDomain } from "./auth";
import { organizationDomain } from "./organization";
import { offeringDomain } from "./offering";
import { offeringScheduleDomain } from "./offeringSchedule";
import { blockedTimeDomain } from "./blockedTime";
import { customerDomain } from "./customer";
import { bookingDomain } from "./booking";
import { systemDomain } from "./system";

/**
 * Every registered domain. Local dev registers all of them onto a single
 * Hono app; production registers exactly one per Lambda (see each domain's
 * `lambda.ts` and `infra/domains.ts`).
 */
export const domains: DomainDefinition[] = [
  authDomain,
  organizationDomain,
  offeringDomain,
  offeringScheduleDomain,
  blockedTimeDomain,
  customerDomain,
  bookingDomain,
  systemDomain,
];
