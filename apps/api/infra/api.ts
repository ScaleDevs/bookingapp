import { lambdaEnvironment } from "./lambda-env";
import * as config from './shared-config';
import { dynamoTable } from "./storage";

console.log({ fullDomain: config.fullDomain });

const accountId = aws.getCallerIdentityOutput({}).accountId;

// Create API Gateway with validated domain configuration
export const api = new sst.aws.ApiGatewayV2('Api', {
    // Custom domain configuration
    ...(config.rootDomain ? {
        domain: {
            name: config.fullDomain,
            cert: config.certificateArn,
            // Remove path mapping to make API accessible at root domain
        },
    } : {}),

    // CORS configuration for frontend integration
    cors: {
        allowOrigins: config.frontendUrls,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        allowCredentials: true,
    },
    // Access log configuration
    accessLog: {
        retention: '1 week',
    },
});

// Route all requests to the Lambda function
api.route('$default', {
    handler: 'src/lambda.handler',
    environment: {
        ...lambdaEnvironment,
        DYNAMO_TABLE_NAME: $output(dynamoTable.name),
    },
    runtime: 'nodejs22.x',
    transform: {
        role: args => {
            // Add our custom policies
            // Note: SST handles merging with default policies internally
            args.inlinePolicies = $output(args.inlinePolicies || []).apply(existing => [
                ...(existing || []),
                {
                    name: 'AppSyncAccess',
                    policy: $jsonStringify({
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Action: [
                                    'appsync:EventConnect',
                                    'appsync:EventSubscribe',
                                    'appsync:EventPublish',
                                ],
                                Resource: '*',
                            },
                        ],
                    }),
                },
                {
                    name: 'SESAccess',
                    policy: $jsonStringify({
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Action: ['ses:SendEmail'],
                                Resource: $interpolate`arn:aws:ses:ap-southeast-1:${accountId}:identity/*`,
                            },
                        ],
                    }),
                },
                {
                    name: 'DynamoDBAccess',
                    policy: $jsonStringify({
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Action: ['dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
                                Resource: dynamoTable.arn,
                            },
                        ],
                    }),
                },
            ]);
        },
    },
});