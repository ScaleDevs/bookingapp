// Build allowed origins based on environment
// In production: only allow FRONTEND_URL

import { env } from "./env";

export const allowedOrigins = env.STAGE === 'production'
    ? [`https://${env.ROOT_DOMAIN}`, `https://www.${env.ROOT_DOMAIN}`]
    : env.ROOT_DOMAIN
        ? [`https://${env.STAGE}.${env.ROOT_DOMAIN}`]
        : [
            'http://localhost:3000',
            'http://localhost:5173',
        ];

export const betterAuthUrl = env.STAGE === 'production'
    ? `https://api.${env.ROOT_DOMAIN}`
    : env.ROOT_DOMAIN
        ? `https://api-${env.STAGE}.${env.ROOT_DOMAIN}`
        : 'http://localhost:3000';

export const isDeployed = env.ROOT_DOMAIN && env.STAGE;