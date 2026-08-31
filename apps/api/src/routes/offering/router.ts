import { type InferSchemaOutput } from "@orpc/server";
import { offerings as offeringsContract, offeringSchema } from "@bookingapp/api-contracts";

import * as offeringAtomic from "@services/offerings/atomic";
import * as offeringQueries from "@services/offerings/queries";
import { createAuthenticatedImplementer } from "../../architecture/orpc/authenticated-procedures";

type Offering = InferSchemaOutput<typeof offeringSchema>;

function asOffering(value: unknown): Offering {
  return value as Offering;
}

const { authed } = createAuthenticatedImplementer(offeringsContract);

export const offeringRouter = authed.router({
  list: authed.list.handler(async ({ context, input }) => {
    return offeringQueries.list(context.service, input);
  }),

  getById: authed.getById.handler(async ({ context, input }) => {
    const offering = await offeringQueries.getById(context.service, input.id);
    return offering ? asOffering(offering) : null;
  }),

  getSelectOptions: authed.getSelectOptions.handler(async ({ context }) => {
    return offeringQueries.getSelectOptions(context.service);
  }),

  create: authed.create.handler(async ({ context, input }) => {
    return asOffering(await offeringAtomic.create(context.service, input));
  }),

  update: authed.update.handler(async ({ context, input }) => {
    return asOffering(await offeringAtomic.update(context.service, input.id, input.data));
  }),

  delete: authed.delete.handler(async ({ context, input }) => {
    return asOffering(await offeringAtomic.remove(context.service, input.id));
  }),

  toggleStatus: authed.toggleStatus.handler(async ({ context, input }) => {
    return asOffering(await offeringAtomic.toggleStatus(context.service, input.id));
  }),
});
