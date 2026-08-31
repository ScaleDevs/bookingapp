import { type InferSchemaOutput } from "@orpc/server";
import {
  offeringSchedules as offeringSchedulesContract,
  offeringScheduleSchema,
} from "@bookingapp/api-contracts";

import * as scheduleAtomic from "@services/offering-schedules/atomic";
import * as scheduleQueries from "@services/offering-schedules/queries";
import { createAuthenticatedImplementer } from "../../architecture/orpc/authenticated-procedures";

type OfferingSchedule = InferSchemaOutput<typeof offeringScheduleSchema>;

function asOfferingSchedule(value: unknown): OfferingSchedule {
  return value as OfferingSchedule;
}

const { authed } = createAuthenticatedImplementer(offeringSchedulesContract);

export const offeringScheduleRouter = authed.router({
  list: authed.list.handler(async ({ context, input }) => {
    return scheduleQueries.list(context.service, input);
  }),

  getById: authed.getById.handler(async ({ context, input }) => {
    return scheduleQueries.getById(context.service, input.id);
  }),

  create: authed.create.handler(async ({ context, input }) => {
    return asOfferingSchedule(await scheduleAtomic.create(context.service, input));
  }),

  update: authed.update.handler(async ({ context, input }) => {
    return asOfferingSchedule(await scheduleAtomic.update(context.service, input.id, input.data));
  }),

  delete: authed.delete.handler(async ({ context, input }) => {
    return asOfferingSchedule(await scheduleAtomic.remove(context.service, input.id));
  }),
});
