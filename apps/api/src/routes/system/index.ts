import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { mountOpenApiRouter } from "../../architecture/orpc/mount-openapi-router";

import { systemRouter } from "./router";

const { basePath, apiPrefix } = DOMAIN_MANIFEST.system;

export const systemDomain = defineDomain({
  name: "system",
  register(app) {
    mountOpenApiRouter(app, {
      basePath,
      apiPrefix,
      router: systemRouter,
    });
  },
});
