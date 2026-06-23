// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sportsclub-fe",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const rootDomain = process.env.ROOT_DOMAIN;
    const certificateArn = process.env.ACM_CERTIFICATE_ARN; // this arn must be in US-EAST-1

    if (!rootDomain) {
      throw new Error("ROOT_DOMAIN is not set");
    }

    if (!certificateArn) {
      throw new Error("ACM_CERTIFICATE_ARN is not set");
    }

    const subdomain = $app.stage === "production" ? "" : `${$app.stage}`;
    const subdomainAPI = $app.stage === "production" ? "api" : `api-${$app.stage}`;
    const fullDomain = subdomain ? `${subdomain}.${rootDomain}` : rootDomain;

    const web = new sst.aws.Nextjs("MyWeb", {
      domain: {
        name: fullDomain,
        cert: certificateArn,
      },
      environment: {
        NEXT_PUBLIC_BASE_API_URL: `https://${subdomainAPI}.${rootDomain}`,
      }
    });

    return {
      web: web.url,
    };
  },
});
