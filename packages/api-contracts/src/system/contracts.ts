import { meta, oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";

import { emptyInputSchema, healthSchema } from "../shared/schema";

export const testProtected = oc
  .meta(
    meta.path(["system", "testProtected"]),
    openapi({
      method: "GET",
      path: "/system/test-protected",
      summary: "Verify an authenticated session",
      tags: ["System"],
    }),
  )
  .input(emptyInputSchema)
  .output(healthSchema);

export const system = {
  testProtected,
};
