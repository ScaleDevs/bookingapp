import { organizations as organizationsContract } from "@bookingapp/api-contracts";

import * as organizationQueries from "@services/organizations/queries";
import { createAuthenticatedImplementer } from "../../architecture/orpc/authenticated-procedures";

const { authed } = createAuthenticatedImplementer(organizationsContract);

export const organizationRouter = authed.router({
  get: authed.get.handler(async ({ context }) => {
    return organizationQueries.getById(context.service);
  }),
});
