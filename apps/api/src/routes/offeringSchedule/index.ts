import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { mountOpenApiRouter } from "../../architecture/orpc/mount-openapi-router";

import { offeringScheduleRouter } from "./router";

const { basePath, apiPrefix } = DOMAIN_MANIFEST.offeringSchedule;

export const offeringScheduleDomain = defineDomain({
  name: "offeringSchedule",
  register(app) {
    mountOpenApiRouter(app, {
      basePath,
      apiPrefix,
      router: offeringScheduleRouter,
    });
  },
});
