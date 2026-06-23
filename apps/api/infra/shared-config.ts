/// <reference path="../.sst/platform/config.d.ts" />

// Direct configuration using SST globals - no functions needed
export const rootDomain = process.env.ROOT_DOMAIN;
export const certificateArn = process.env.ACM_CERTIFICATE_ARN;

// Stage-based subdomain
export const subdomain = $app.stage === 'production' ? 'api' : `api-${$app.stage}`;
export const fullDomain = `${subdomain}.${rootDomain}`;

// Stage-based frontend URL
export const frontendUrls = $app.stage === 'production'
  ? [`https://${rootDomain}`, `https://www.${rootDomain}`]
  : rootDomain
    ? [`https://${$app.stage}.${rootDomain}`]
    : [
      'http://localhost:3000',
      'http://localhost:5173',
    ];


// SES configuration
export const sesRegion = process.env.SES_REGION || 'ap-southeast-1';

// Log configuration for visibility
console.log({
  stage: $app.stage,
  rootDomain,
  subdomain,
  fullDomain,
});
