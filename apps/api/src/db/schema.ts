import { sql } from 'drizzle-orm';
import {
    pgTable,
    text,
    timestamp,
    boolean,
    index,
    uuid,
    numeric,
    decimal,
} from 'drizzle-orm/pg-core';
import { organization } from './auth-schema';


/**
 * Offering: Represents a service or event that an organization provides.
 */
export const offering = pgTable(
    "offering",
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

        organizationId: text("organization_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),

        price: decimal("price", { precision: 12, scale: 2 }).notNull(),

        currency: text("currency").default("PHP").notNull(),

        name: text("name").notNull(),

        description: text("description"),

        durationMinutes: numeric("duration_minutes").notNull(),

        capacity: numeric("capacity").notNull(),

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at", { mode: 'date', withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {
            mode: "date",
            withTimezone: true,
        })
            .defaultNow()
            .$onUpdateFn(() => sql`now()`)
            .notNull(),
    },
    (table) => [index("offering_organization_id_idx").on(table.organizationId)],
);

/**
 * OfferingSchedule: Defines regular weekly slots when an offering is available (by day and time).
 */
export const offeringSchedule = pgTable(
    "offering_schedule",
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

        offeringId: uuid("offering_id")
            .notNull()
            .references(() => offering.id, { onDelete: "cascade" }),

        dayOfWeek: numeric("day_of_week").notNull(), // 0-6

        startTime: text("start_time").notNull(), // HH:mm
        endTime: text("end_time").notNull(), // HH:mm

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at", { mode: 'date', withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {
            mode: "date",
            withTimezone: true,
        })
            .defaultNow()
            .$onUpdateFn(() => sql`now()`)
            .notNull(),
    },
    (table) => [
        index("offering_schedule_offering_id_idx").on(table.offeringId),
    ],
);

/**
 * BlockedTime: Represents a period when an offering is unavailable (for breaks, holidays, etc.).
 */
export const blockedTime = pgTable(
    "blocked_time",
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

        offeringId: uuid("offering_id")
            .notNull()
            .references(() => offering.id, { onDelete: "cascade" }),

        startsAt: timestamp("starts_at", { mode: 'date', withTimezone: true }).notNull(),

        endsAt: timestamp("ends_at", { mode: 'date', withTimezone: true }).notNull(),

        reason: text("reason"),

        createdAt: timestamp("created_at", { mode: 'date', withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {
            mode: "date",
            withTimezone: true,
        })
            .defaultNow()
            .$onUpdateFn(() => sql`now()`)
            .notNull(),
    },
    (table) => [index("blocked_time_offering_id_idx").on(table.offeringId)],
);

/**
 * Customer: Represents a customer who can make bookings for offerings.
 */
export const customer = pgTable(
    "customer",
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

        organizationId: text("organization_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),

        name: text("name").notNull(),
        email: text("email"),
        phone: text("phone"),
        notes: text("notes"),

        createdAt: timestamp("created_at", { mode: 'date', withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {
            mode: "date",
            withTimezone: true,
        })
            .defaultNow()
            .$onUpdateFn(() => sql`now()`)
            .notNull(),
    },
    (table) => [
        index("customer_organization_id_idx").on(table.organizationId),
        index("customer_email_idx").on(table.email),
        index("customer_phone_idx").on(table.phone),
    ],
);

/**
 * Booking: Represents a booking made by a customer for an offering at a specified time.
 */
export const booking = pgTable(
    "booking",
    {
        id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),

        organizationId: text("organization_id")
            .notNull()
            .references(() => organization.id, { onDelete: "cascade" }),

        offeringId: uuid("offering_id")
            .notNull()
            .references(() => offering.id, { onDelete: "restrict" }),

        customerId: uuid("customer_id")
            .notNull()
            .references(() => customer.id, { onDelete: "restrict" }),

        startsAt: timestamp("starts_at", { mode: 'date', withTimezone: true }).notNull(),

        endsAt: timestamp("ends_at", { mode: 'date', withTimezone: true }).notNull(),

        status: text("status").default("confirmed").notNull(),

        notes: text("notes"),

        createdAt: timestamp("created_at", { mode: 'date', withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", {
            mode: "date",
            withTimezone: true,
        })
            .defaultNow()
            .$onUpdateFn(() => sql`now()`)
            .notNull(),
    },
    (table) => [
        index("booking_organization_id_idx").on(table.organizationId),
        index("booking_offering_id_idx").on(table.offeringId),
        index("booking_customer_id_idx").on(table.customerId),
        index("booking_starts_at_idx").on(table.startsAt),
    ],
);