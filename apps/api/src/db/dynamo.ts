import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CustomAttributeType, Entity } from "electrodb";
import { env } from "../utils/env";

const client = new DynamoDBClient();

const table = env.DYNAMO_TABLE_NAME;

/** Fixed width so string ordering matches chronological order on the primary sort key. */
export const CREATED_AT_MS_KEY_WIDTH = 20;

export function formatCreatedAtMsKey(timestampEpochMs: number): string {
    return String(timestampEpochMs).padStart(CREATED_AT_MS_KEY_WIDTH, "0");
}

/** Mirrors `audit_logs` in PostgreSQL; `auditLogId` replaces the serial `id`. */
export const AuditLog = new Entity(
    {
        model: {
            entity: "auditLog",
            version: "1",
            service: "kardops",
        },
        attributes: {
            auditLogId: {
                type: "string",
                required: true,
            },
            /** Must equal `formatCreatedAtMsKey(timestampEpochMs)` for every put/update. */
            createdAtMsKey: {
                type: "string",
                required: true,
            },
            createdAt: {
                type: "string",
                required: true,
            },
            userId: {
                type: "string",
            },
            endpoint: {
                type: "string",
                required: true,
            },
            timestamp: {
                type: "string",
                required: true,
            },
            timestampEpochMs: {
                type: "number",
                required: true,
            },
            status: {
                type: ["SUCCESS", "FAILURE"] as const,
                required: true,
            },
            errorMessage: {
                type: "string",
            },
            requestMethod: {
                type: "string",
                required: true,
            },
            ipAddress: {
                type: "string",
            },
            userAgent: {
                type: "string",
            },
            requestBody: {
                type: CustomAttributeType<unknown>("any"),
            },
            requestParams: {
                type: CustomAttributeType<Record<string, string>>("any"),
            },
        },
        indexes: {
            /**
             * All audit logs in a created-at range (inclusive): Query `pk = AUDIT_LOG` and
             * `sk` BETWEEN `createdAtMsKey#minId` … `createdAtMsKey#maxId` via
             * `queryAuditLogsByCreatedAtRange` or `.byCreatedAt(...).between(...)`.
             */
            byEndpoint: {
                pk: {
                    field: "pk",
                    composite: ["auditLogId"],
                },
                sk: {
                    field: "sk",
                    composite: ["endpoint"],
                },
            },
            /** Logs for one endpoint, ordered by `timestampEpochMs` (range-friendly number SK). */
            byCreatedAt: {
                index: "Gsi1Index",
                pk: {
                    field: "gsi1pk",
                    composite: ["createdAt"],
                },
                sk: {
                    field: "gsi1sk",
                    composite: ["createdAtMsKey", "auditLogId"],
                },
            },
        },
    },
    { client, table },
);