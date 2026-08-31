import { lambdaEnvironment } from "./lambda-env";
import * as config from "./shared-config";
import { dynamoTable } from "./storage";
import { domainRoutes } from "./domains";
import { createLambdaRoleTransform } from "./lambda-policies";

console.log({ fullDomain: config.fullDomain });

const accountId = aws.getCallerIdentityOutput({}).accountId;

export const api = new sst.aws.ApiGatewayV2("Api", {
    ...(config.rootDomain ? {
        domain: {
            name: config.fullDomain,
            cert: config.certificateArn,
        },
    } : {}),

    cors: {
        allowOrigins: config.frontendUrls,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        allowCredentials: true,
    },
    accessLog: {
        retention: "1 week",
    },
});

const sharedRouteConfig = {
    environment: {
        ...lambdaEnvironment,
        DYNAMO_TABLE_NAME: $output(dynamoTable.name),
    },
    runtime: "nodejs22.x" as const,
    transform: {
        role: createLambdaRoleTransform({ accountId, dynamoTable }),
    },
};

for (const domain of domainRoutes) {
    api.route(domain.routeKey, {
        handler: domain.handler,
        ...sharedRouteConfig,
    });
}
