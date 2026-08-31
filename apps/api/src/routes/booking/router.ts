import { type InferSchemaOutput } from "@orpc/server";
import { bookings as bookingsContract, bookingSchema } from "@bookingapp/api-contracts";

import * as bookingAtomic from "@services/bookings/atomic";
import * as bookingOrchestration from "@services/bookings/orchestration";
import * as bookingQueries from "@services/bookings/queries";
import { createAuthenticatedImplementer } from "../../architecture/orpc/authenticated-procedures";

type Booking = InferSchemaOutput<typeof bookingSchema>;

function asBooking(value: unknown): Booking {
  return value as Booking;
}

const { authed } = createAuthenticatedImplementer(bookingsContract);

export const bookingRouter = authed.router({
  list: authed.list.handler(async ({ context }) => {
    return bookingQueries.list(context.service);
  }),

  getById: authed.getById.handler(async ({ context, input }) => {
    const booking = await bookingQueries.getById(context.service, input.id);
    return booking ? asBooking(booking) : null;
  }),

  create: authed.create.handler(async ({ context, input }) => {
    return asBooking(await bookingOrchestration.create(context.service, input));
  }),

  update: authed.update.handler(async ({ context, input }) => {
    return asBooking(await bookingAtomic.update(context.service, input.id, input.data));
  }),

  delete: authed.delete.handler(async ({ context, input }) => {
    return asBooking(await bookingAtomic.remove(context.service, input.id));
  }),
});
