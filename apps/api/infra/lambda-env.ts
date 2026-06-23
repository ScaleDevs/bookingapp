/// <reference path="../.sst/platform/config.d.ts" />

import * as config from './shared-config';

/**
 * Validates that required environment variables are set
 */
function getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

/**
 * Shared environment variables for all Lambda functions
 * This configuration ensures consistency across all Lambda functions
 * and makes it easy to manage environment variables in one place
 */
export const lambdaEnvironment = {
    ROOT_DOMAIN: config.rootDomain ?? "",
    STAGE: $app.stage ?? "",
    ...(process.env.NODE_ENV && { NODE_ENV: process.env.NODE_ENV }),

    // Database configuration
    DATABASE_URL: getRequiredEnvVar('DATABASE_URL'),
    ...(process.env.SSL_DISABLED && { SSL_DISABLED: process.env.SSL_DISABLED }),

    // Better Auth configuration,
    BETTER_AUTH_SECRET: getRequiredEnvVar('BETTER_AUTH_SECRET'),
};

// Export type for TypeScript support
export type LambdaEnvironment = typeof lambdaEnvironment;
