import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter, RouterOutputs, RouterInputs } from '../../../api/src/router';

export const trpc = createTRPCReact<AppRouter>()

export type TRPCOutputs = RouterOutputs;
export type TRPCInputs = RouterInputs;