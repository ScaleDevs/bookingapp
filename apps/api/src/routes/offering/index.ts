import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { mountOpenApiRouter } from "../../architecture/orpc/mount-openapi-router";

import { offeringRouter } from "./router";

const { basePath, apiPrefix } = DOMAIN_MANIFEST.offering;

export const offeringDomain = defineDomain({
  name: "offering",
  register(app) {
    mountOpenApiRouter(app, {
      basePath,
      apiPrefix,
      router: offeringRouter,
    });
  },
});
