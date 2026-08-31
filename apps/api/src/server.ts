import { serve } from "@hono/node-server";

import { createApp } from "./create-app";
import { env } from "./utils/env";
import { createLogger } from "./utils/logger";

const logger = createLogger("Server Initializing");
const app = createApp();

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    logger.info("Starting server with configuration:", {
      port: info.port,
      environment: env.NODE_ENV,
      url: `http://localhost:${info.port}`,
    });
    logger.success(`Server is running on http://localhost:${info.port}`);
  },
);
