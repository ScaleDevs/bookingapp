import { type InferSchemaOutput } from "@orpc/server";
import { blockedTimes as blockedTimesContract, blockedTimeSchema } from "@bookingapp/api-contracts";

import * as blockedTimeAtomic from "@services/blocked-times/atomic";
import * as blockedTimeQueries from "@services/blocked-times/queries";
import { createAuthenticatedImplementer } from "../../architecture/orpc/authenticated-procedures";

type BlockedTime = InferSchemaOutput<typeof blockedTimeSchema>;

function asBlockedTime(value: unknown): BlockedTime {
  return value as BlockedTime;
}

const { authed } = createAuthenticatedImplementer(blockedTimesContract);

export const blockedTimeRouter = authed.router({
  list: authed.list.handler(async ({ context, input }) => {
    return blockedTimeQueries.list(context.service, input);
  }),

  getById: authed.getById.handler(async ({ context, input }) => {
    const result = await blockedTimeQueries.getById(context.service, input.id);
    return result ?? null;
  }),

  create: authed.create.handler(async ({ context, input }) => {
    return asBlockedTime(await blockedTimeAtomic.create(context.service, input));
  }),

  update: authed.update.handler(async ({ context, input }) => {
    return asBlockedTime(await blockedTimeAtomic.update(context.service, input.id, input.data));
  }),

  delete: authed.delete.handler(async ({ context, input }) => {
    return asBlockedTime(await blockedTimeAtomic.remove(context.service, input.id));
  }),
});
