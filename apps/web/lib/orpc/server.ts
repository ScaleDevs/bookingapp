import "server-only";

import type { ContractClientFactory, RouterContract } from "@orpc/contract";
import { createContractJsonifiedClientFactory } from "@orpc/openapi";
import { createContractJsonifiedUtilsFactory } from "@orpc/tanstack-query";
import { OpenAPILink } from "@orpc/openapi/fetch";
import { cookies } from "next/headers";
import { cache } from "react";
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
import { makeQueryClient } from "./make-query-client";

export const getQueryClient = cache(makeQueryClient);

export const getORPCQueryUtils = cache(async () => {
  const cookieStore = await cookies();
  const contractRef = {} as RouterContract;
  const apiOrigin = getBaseApiUrl();

  const link = new OpenAPILink(contractRef as never, {
    ...(apiOrigin ? { origin: apiOrigin } : {}),
    url: "/api",
    headers: () => ({
      cookie: cookieStore.toString(),
    }),
  });

  const createClient = createContractJsonifiedClientFactory(link, {
    contractRef,
  });

  const createUtils = createContractJsonifiedUtilsFactory(
    createClient as ContractClientFactory<object>,
    {},
  );

  return {
    queryClient: getQueryClient(),
    offeringClient: createUtils(offerings),
    offeringScheduleClient: createUtils(offeringSchedules),
    blockedTimeClient: createUtils(blockedTimes),
    customerClient: createUtils(customers),
    bookingClient: createUtils(bookings),
    organizationClient: createUtils(organizations),
    systemClient: createUtils(system),
  };
});
