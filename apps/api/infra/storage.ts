export const dynamoTable = new sst.aws.Dynamo("DynamoTable", {
    fields: {
        pk: "string",
        sk: "string",
        gsi1pk: "string",
        gsi1sk: "string",
    },
    primaryIndex: { hashKey: "pk", rangeKey: "sk" },
    globalIndexes: {
        Gsi1Index: { hashKey: "gsi1pk", rangeKey: "gsi1sk" }
    }
});