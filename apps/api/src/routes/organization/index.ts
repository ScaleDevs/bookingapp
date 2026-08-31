import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { mountOpenApiRouter } from "../../architecture/orpc/mount-openapi-router";

import { organizationRouter } from "./router";

const { basePath, apiPrefix } = DOMAIN_MANIFEST.organization;

export const organizationDomain = defineDomain({
  name: "organization",
  register(app) {
    mountOpenApiRouter(app, {
      basePath,
      apiPrefix,
      router: organizationRouter,
    });
  },
});
