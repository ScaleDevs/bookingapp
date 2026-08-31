import { type InferSchemaOutput } from "@orpc/server";
import { customers as customersContract, customerSchema } from "@bookingapp/api-contracts";

import * as customerAtomic from "@services/customers/atomic";
import * as customerQueries from "@services/customers/queries";
import { createAuthenticatedImplementer } from "../../architecture/orpc/authenticated-procedures";

type Customer = InferSchemaOutput<typeof customerSchema>;

function asCustomer(value: unknown): Customer {
  return value as Customer;
}

const { authed } = createAuthenticatedImplementer(customersContract);

export const customerRouter = authed.router({
  list: authed.list.handler(async ({ context }) => {
    return customerQueries.list(context.service);
  }),

  getById: authed.getById.handler(async ({ context, input }) => {
    const customer = await customerQueries.getById(context.service, input.id);
    return customer ? asCustomer(customer) : null;
  }),

  create: authed.create.handler(async ({ context, input }) => {
    return asCustomer(await customerAtomic.create(context.service, input));
  }),

  update: authed.update.handler(async ({ context, input }) => {
    return asCustomer(await customerAtomic.update(context.service, input.id, input.data));
  }),

  delete: authed.delete.handler(async ({ context, input }) => {
    return asCustomer(await customerAtomic.remove(context.service, input.id));
  }),
});
