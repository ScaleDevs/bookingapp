import { system as systemContract } from "@bookingapp/api-contracts";

import { createAuthenticatedImplementer } from "../../architecture/orpc/authenticated-procedures";

const { authed } = createAuthenticatedImplementer(systemContract);

export const systemRouter = authed.router({
  testProtected: authed.testProtected.handler(async () => ({
    status: "ok" as const,
    message: "Service is healthy",
  })),
});
