import 'dotenv/config';
import * as v from 'valibot';

/**
 * Environment variable validation schema
 * Defines all required and optional environment variables with their types
 */
const envSchema = v.object({
    ROOT_DOMAIN: v.optional(v.pipe(v.string(), v.description('Root domain'))),
    STAGE: v.optional(v.pipe(v.string(), v.description('Stage'))),

    // Better Auth configuration
    BETTER_AUTH_SECRET: v.optional(v.pipe(v.string(), v.description('Secret key for Better Auth'))),

    // Database configuration
    DYNAMO_TABLE_NAME: v.pipe(v.string(), v.minLength(1), v.description('DynamoDB table name')),
    DATABASE_URL: v.pipe(v.string(), v.minLength(1), v.description('PostgreSQL connection URL')),
    SSL_DISABLED: v.optional(
        v.pipe(v.string(), v.description('Disable SSL for local development')),
        'false',
    ),

    // Node environment
    NODE_ENV: v.optional(
        v.pipe(
            v.picklist(['development', 'production', 'test', 'local']),
            v.description('Node environment'),
        ),
        'development',
    ),

    // Server configuration
    PORT: v.optional(
        v.pipe(
            v.string(),
            v.regex(/^\d+$/),
            v.transform(Number),
            v.description('Server port for local development'),
        ),
        '3000',
    ),
});

/**
 * Type definition for validated environment variables
 */
export type Env = v.InferOutput<typeof envSchema>;

/**
 * Validates and parses environment variables
 * Throws an error with detailed information if validation fails
 */
function validateEnv(): Env {
    const result = v.safeParse(envSchema, process.env);

    if (!result.success) {
        const errorMessage = result.issues
            .map((issue) => {
                const path = issue.path?.map((segment) => segment.key).filter(Boolean).join('.');
                return path ? `${path}: ${issue.message}` : issue.message;
            })
            .join('\n');

        throw new Error(
            `Environment variable validation failed:\n${errorMessage}\n\n` +
            `Please ensure all required environment variables are set in your .env file.`,
        );
    }

    return result.output;
}

/**
 * Validated environment variables
 * Access this instead of process.env throughout the application
 */
export const env = validateEnv();

/**
 * Re-export the schema for testing or other validation needs
 */
export { envSchema };
