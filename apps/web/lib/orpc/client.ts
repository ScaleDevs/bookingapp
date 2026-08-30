import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import {
  inferRPCMethodFromContractRouter,
  type ContractRouterClient,
  type InferContractRouterOutputs,
} from '@orpc/contract';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';

import { contract, type ApiContract } from '@bookingapp/api-contracts';
import { getBaseApiUrl } from '@/lib/constant';

const link = new RPCLink({
  url: `${getBaseApiUrl()}/api/orpc`,
  method: inferRPCMethodFromContractRouter(contract),
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: 'include',
    });
  },
});

export const orpcClient: ContractRouterClient<ApiContract> = createORPCClient(link);
export const orpc = createTanstackQueryUtils(orpcClient);

export type APIOutputs = InferContractRouterOutputs<ApiContract>;
