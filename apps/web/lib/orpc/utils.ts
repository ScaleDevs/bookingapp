'use client';

import { useQueryClient } from '@tanstack/react-query';

import { orpc } from './client';

export function useORPCUtils() {
  const queryClient = useQueryClient();

  return {
    offerings: {
      list: {
        invalidate: () =>
          queryClient.invalidateQueries({ queryKey: orpc.offerings.list.key() }),
      },
      getById: {
        invalidate: () =>
          queryClient.invalidateQueries({ queryKey: orpc.offerings.getById.key() }),
      },
    },
    offeringSchedules: {
      list: {
        invalidate: () =>
          queryClient.invalidateQueries({
            queryKey: orpc.offeringSchedules.list.key(),
          }),
      },
    },
    blockedTimes: {
      list: {
        invalidate: () =>
          queryClient.invalidateQueries({ queryKey: orpc.blockedTimes.list.key() }),
      },
    },
  };
}
