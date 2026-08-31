import { defineDomain } from "../../architecture/domain";
import { DOMAIN_MANIFEST } from "../../architecture/manifest";
import { mountOpenApiRouter } from "../../architecture/orpc/mount-openapi-router";

import { bookingRouter } from "./router";

const { basePath, apiPrefix } = DOMAIN_MANIFEST.booking;

export const bookingDomain = defineDomain({
  name: "booking",
  register(app) {
    mountOpenApiRouter(app, {
      basePath,
      apiPrefix,
      router: bookingRouter,
    });
  },
});
