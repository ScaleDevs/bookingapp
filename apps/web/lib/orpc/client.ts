import type { ContractClientFactory, RouterContract } from "@orpc/contract";
import { createContractJsonifiedClientFactory } from "@orpc/openapi";
import { createContractJsonifiedUtilsFactory } from "@orpc/tanstack-query";
import { OpenAPILink } from "@orpc/openapi/fetch";
import {
  blockedTimes,
  bookings,
  customers,
  offeringSchedules,
  offerings,
  organizations,
  system,
} from "@bookingapp/api-contracts";

import { getBaseApiUrl } from "@/lib/constant";
import type { ContractOutputs } from "./contract-types";

const contractRef = {} as RouterContract;
const apiOrigin = getBaseApiUrl();

const link = new OpenAPILink(contractRef as never, {
  ...(apiOrigin ? { origin: apiOrigin } : {}),
  url: "/api",
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});

export const createClient = createContractJsonifiedClientFactory(link, {
  contractRef,
});

export const createUtils = createContractJsonifiedUtilsFactory(
  createClient as ContractClientFactory<object>,
  {},
);

export const offeringClient = createUtils(offerings);
export const offeringScheduleClient = createUtils(offeringSchedules);
export const blockedTimeClient = createUtils(blockedTimes);
export const customerClient = createUtils(customers);
export const bookingClient = createUtils(bookings);
export const organizationClient = createUtils(organizations);
export const systemClient = createUtils(system);

/**
 * Nested client used by existing Next.js call sites. Domain clients above
 * match the KardOps `createUtils(contract)` pattern and remain the source
 * of truth.
 */
export const orpc = {
  offerings: offeringClient,
  offeringSchedules: offeringScheduleClient,
  blockedTimes: blockedTimeClient,
  customers: customerClient,
  bookings: bookingClient,
  organizations: organizationClient,
  system: systemClient,
};

export type APIOutputs = {
  offerings: ContractOutputs<typeof offerings>;
  offeringSchedules: ContractOutputs<typeof offeringSchedules>;
  blockedTimes: ContractOutputs<typeof blockedTimes>;
  customers: ContractOutputs<typeof customers>;
  bookings: ContractOutputs<typeof bookings>;
  organizations: ContractOutputs<typeof organizations>;
};
