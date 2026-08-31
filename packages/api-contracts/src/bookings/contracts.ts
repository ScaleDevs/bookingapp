import { meta, oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import * as v from "valibot";

import { emptyInputSchema, idInputSchema, uuidSchema } from "../shared/schema";
import { bookingSchema, createBookingInputSchema } from "./schema";

export const list = oc
  .meta(
    meta.path(["bookings", "list"]),
    openapi({
      method: "GET",
      path: "/bookings",
      summary: "List bookings",
      tags: ["Bookings"],
    }),
  )
  .input(emptyInputSchema)
  .output(v.array(bookingSchema));

export const getById = oc
  .meta(
    meta.path(["bookings", "getById"]),
    openapi({
      method: "GET",
      path: "/bookings/{id}",
      summary: "Get a booking by id",
      tags: ["Bookings"],
    }),
  )
  .input(idInputSchema)
  .output(v.nullable(bookingSchema));

export const create = oc
  .meta(
    meta.path(["bookings", "create"]),
    openapi({
      method: "POST",
      path: "/bookings",
      summary: "Create a booking",
      tags: ["Bookings"],
    }),
  )
  .input(createBookingInputSchema)
  .output(bookingSchema);

export const update = oc
  .meta(
    meta.path(["bookings", "update"]),
    openapi({
      method: "PATCH",
      path: "/bookings/{id}",
      summary: "Update a booking",
      tags: ["Bookings"],
    }),
  )
  .input(
    v.object({
      id: uuidSchema,
      data: v.partial(
        v.object({
          startsAt: v.date(),
          endsAt: v.date(),
          status: v.optional(v.string()),
          notes: v.optional(v.nullable(v.string())),
        }),
      ),
    }),
  )
  .output(bookingSchema);

export const deleteBooking = oc
  .meta(
    meta.path(["bookings", "delete"]),
    openapi({
      method: "DELETE",
      path: "/bookings/{id}",
      summary: "Delete a booking",
      tags: ["Bookings"],
    }),
  )
  .input(idInputSchema)
  .output(bookingSchema);

export const bookings = {
  list,
  getById,
  create,
  update,
  delete: deleteBooking,
};
