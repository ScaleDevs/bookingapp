import { meta, oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";

import { emptyInputSchema } from "../shared/schema";
import { organizationSchema } from "./schema";

export const get = oc
  .meta(
    meta.path(["organizations", "get"]),
    openapi({
      method: "GET",
      path: "/organizations",
      summary: "Get the active organization",
      tags: ["Organizations"],
    }),
  )
  .input(emptyInputSchema)
  .output(organizationSchema);

export const organizations = {
  get,
};
