import { OpenAPIGenerator } from "@orpc/openapi";
import { ValibotToJsonSchemaConverter } from "@orpc/valibot";
import type { AnyRouter } from "@orpc/server";

import { DOMAIN_MANIFEST } from "../manifest";
import type { SharedApp } from "../types";

const openApiGenerator = new OpenAPIGenerator({
  converters: [new ValibotToJsonSchemaConverter()],
});

export const OPENAPI_SPEC_PATH = "/openapi.json";
export const OPENAPI_DOCS_PATH = "/docs";

/** Better Auth schema endpoint (requires the `openAPI()` plugin). */
export const AUTH_OPENAPI_SPEC_PATH = `${DOMAIN_MANIFEST.auth.basePath}/open-api/generate-schema`;

function createScalarHtml(sources: { url: string; title: string }[]): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <title>BookingApp API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      Scalar.createApiReference("#app", {
        sources: ${JSON.stringify(sources)},
        withDefaultFonts: true,
      });
    </script>
  </body>
</html>`;
}

/**
 * Serves the generated OpenAPI spec and a Scalar API reference UI.
 * Intended for local development and internal API exploration.
 */
export function mountOpenApiDocs(app: SharedApp, router: AnyRouter): void {
  app.get(OPENAPI_SPEC_PATH, async (c) => {
    const spec = await openApiGenerator.generate(router, {
      base: {
        info: {
          title: "BookingApp API",
          version: "1.0.0",
          description: "OpenAPI specification for BookingApp oRPC domains.",
        },
        servers: [{ url: "/api" }],
      },
    });

    return c.json(spec);
  });

  app.get(OPENAPI_DOCS_PATH, (c) => {
    return c.html(
      createScalarHtml([
        { url: AUTH_OPENAPI_SPEC_PATH, title: "Auth" },
        { url: OPENAPI_SPEC_PATH, title: "BookingApp API" },
      ]),
    );
  });
}
