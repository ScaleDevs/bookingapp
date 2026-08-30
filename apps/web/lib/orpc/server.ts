import 'server-only';

import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import {
  inferRPCMethodFromContractRouter,
  type ContractRouterClient,
} from '@orpc/contract';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { contract, type ApiContract } from '@bookingapp/api-contracts';
import { getBaseApiUrl } from '@/lib/constant';
import { makeQueryClient } from './make-query-client';

export const getQueryClient = cache(makeQueryClient);

export const getORPCServerClient = cache(async () => {
  const cookieStore = await cookies();

  const link = new RPCLink({
    url: `${getBaseApiUrl()}/api/orpc`,
    method: inferRPCMethodFromContractRouter(contract),
    headers: () => ({
      cookie: cookieStore.toString(),
    }),
  });

  return createORPCClient(link) as ContractRouterClient<ApiContract>;
});

export const getORPCQueryUtils = cache(async () => {
  const queryClient = getQueryClient();
  const orpcClient = await getORPCServerClient();

  return {
    orpc: createTanstackQueryUtils(orpcClient),
    queryClient,
  };
});
