// lib/trpc/server.ts
import 'server-only';

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCQueryUtils } from '@trpc/react-query';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { getBaseApiUrl } from "@/lib/constant"
import type { AppRouter } from '../../../api/src/router';
import { makeQueryClient } from './make-query-client';

export const getQueryClient = cache(makeQueryClient);
export const getTRPCServerClient = cache(async () => {
  const cookieStore = await cookies();

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getBaseApiUrl() + "/api/trpc",
        headers() {
          return {
            cookie: cookieStore.toString(),
          };
        },
      }),
    ],
  });
});

export const getTRPCQueryUtils = cache(async () => {
  const queryClient = getQueryClient();
  const trpcClient = await getTRPCServerClient();

  return {
    trpc: createTRPCQueryUtils({
      queryClient,
      client: trpcClient,
    }),
    queryClient,
  }
});