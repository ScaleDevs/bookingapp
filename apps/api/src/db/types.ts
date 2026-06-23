import { organization, user } from "./auth-schema";

// ******************************* //
// ** Organization Schema Types ** //
// ******************************* //
export type Organization = typeof organization.$inferSelect;
export type NewOrganization = typeof organization.$inferInsert;

// ******************************* //
// ****** User Schema Types ****** //
// ******************************* //
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
