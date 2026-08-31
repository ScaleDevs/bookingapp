import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { mountOpenApiRouter } from "../../architecture/orpc/mount-openapi-router";

import { customerRouter } from "./router";

const { basePath, apiPrefix } = DOMAIN_MANIFEST.customer;

export const customerDomain = defineDomain({
  name: "customer",
  register(app) {
    mountOpenApiRouter(app, {
      basePath,
      apiPrefix,
      router: customerRouter,
    });
  },
});
