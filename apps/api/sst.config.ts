/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sportsclub-be",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const storageInfra = await import("./infra/storage");

    if ($app.stage === "local")
      return {
        dynamoTable: storageInfra.dynamoTable.name,
      }

    const apiInfra = await import("./infra/api");

    return {
      // Storage outputs
      dynamoTable: storageInfra.dynamoTable.name,

      // API outputs
      apiUrl: apiInfra.api.url,
    }
  },
});
