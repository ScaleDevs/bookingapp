/**
 * Shared IAM policy attachments applied to every domain Lambda,
 * defined exactly once so no route duplicates them.
 */
export function createLambdaRoleTransform(options: {
    accountId: any;
    dynamoTable: { arn: any };
}) {
    const { accountId, dynamoTable } = options;

    return (args: any): undefined => {
        args.inlinePolicies = $output(args.inlinePolicies || []).apply((existing: any[]) => [
            ...(existing || []),
            {
                name: "AppSyncAccess",
                policy: $jsonStringify({
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Effect: "Allow",
                            Action: [
                                "appsync:EventConnect",
                                "appsync:EventSubscribe",
                                "appsync:EventPublish",
                            ],
                            Resource: "*",
                        },
                    ],
                }),
            },
            {
                name: "SESAccess",
                policy: $jsonStringify({
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Effect: "Allow",
                            Action: ["ses:SendEmail"],
                            Resource: $interpolate`arn:aws:ses:ap-southeast-1:${accountId}:identity/*`,
                        },
                    ],
                }),
            },
            {
                name: "DynamoDBAccess",
                policy: $jsonStringify({
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Effect: "Allow",
                            Action: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
                            Resource: dynamoTable.arn,
                        },
                    ],
                }),
            },
        ]);
    };
}
