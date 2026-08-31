import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { mountOpenApiRouter } from "../../architecture/orpc/mount-openapi-router";

import { blockedTimeRouter } from "./router";

const { basePath, apiPrefix } = DOMAIN_MANIFEST.blockedTime;

export const blockedTimeDomain = defineDomain({
  name: "blockedTime",
  register(app) {
    mountOpenApiRouter(app, {
      basePath,
      apiPrefix,
      router: blockedTimeRouter,
    });
  },
});
