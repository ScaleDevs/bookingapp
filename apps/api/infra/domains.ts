import { DOMAIN_MANIFEST } from "../src/architecture/manifest";

export interface DomainRoute {
    name: string;
    /** ApiGatewayV2 route key, matching every method and sub-path under the domain's base path. */
    routeKey: string;
    /** Path (relative to this app's root) to the domain's own Lambda handler. */
    handler: string;
}

/**
 * Derives one API Gateway route + Lambda handler per domain registered in
 * `src/architecture/manifest.ts`. Onboarding a new domain therefore requires
 * no changes here or in `api.ts` — adding it to the manifest (plus creating
 * its `routes/<name>/lambda.ts`) is enough for it to receive its own Lambda
 * automatically.
 */
export const domainRoutes: DomainRoute[] = Object.entries(DOMAIN_MANIFEST).flatMap(
    ([name, { basePath }]) => [
        {
            name,
            routeKey: `ANY ${basePath}`,
            handler: `src/routes/${name}/lambda.handler`,
        },
        {
            name,
            routeKey: `ANY ${basePath}/{proxy+}`,
            handler: `src/routes/${name}/lambda.handler`,
        },
    ],
);
