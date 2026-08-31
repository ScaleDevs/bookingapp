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
