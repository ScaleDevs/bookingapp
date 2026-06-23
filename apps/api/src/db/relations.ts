import { relations } from "drizzle-orm";
import { organization, user, session, account, member, invitation } from "./auth-schema";
import {
    offering,
    offeringSchedule,
    blockedTime,
    customer,
    booking,
} from "./schema";

// ******************************* //
// ******** Auth Schema ********** //
// ******************************* //

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    members: many(member),
    invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
    invitations: many(invitation),
    offerings: many(offering),
    customers: many(customer),
    bookings: many(booking),
}));

export const memberRelations = relations(member, ({ one }) => ({
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id],
    }),
    user: one(user, {
        fields: [member.userId],
        references: [user.id],
    }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
    organization: one(organization, {
        fields: [invitation.organizationId],
        references: [organization.id],
    }),
    user: one(user, {
        fields: [invitation.inviterId],
        references: [user.id],
    }),
}));

// ******************************** //
// ****** Booking Schema ****** //
// ******************************** //

export const offeringRelations = relations(offering, ({ one, many }) => ({
    organization: one(organization, {
        fields: [offering.organizationId],
        references: [organization.id],
    }),
    schedules: many(offeringSchedule),
    blockedTimes: many(blockedTime),
    bookings: many(booking),
}));

export const offeringScheduleRelations = relations(offeringSchedule, ({ one }) => ({
    offering: one(offering, {
        fields: [offeringSchedule.offeringId],
        references: [offering.id],
    }),
}));

export const blockedTimeRelations = relations(blockedTime, ({ one }) => ({
    offering: one(offering, {
        fields: [blockedTime.offeringId],
        references: [offering.id],
    }),
}));

export const customerRelations = relations(customer, ({ one, many }) => ({
    organization: one(organization, {
        fields: [customer.organizationId],
        references: [organization.id],
    }),
    bookings: many(booking),
}));

export const bookingRelations = relations(booking, ({ one }) => ({
    organization: one(organization, {
        fields: [booking.organizationId],
        references: [organization.id],
    }),
    offering: one(offering, {
        fields: [booking.offeringId],
        references: [offering.id],
    }),
    customer: one(customer, {
        fields: [booking.customerId],
        references: [customer.id],
    }),
}));