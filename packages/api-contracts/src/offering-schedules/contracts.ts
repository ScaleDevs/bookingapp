import { meta, oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import * as v from "valibot";

import { idInputSchema, listInputSchema, paginationSchema, uuidSchema } from "../shared/schema";
import {
  createOfferingScheduleInputSchema,
  offeringScheduleDetailSchema,
  offeringScheduleListItemSchema,
  offeringScheduleSchema,
} from "./schema";

export const list = oc
  .meta(
    meta.path(["offeringSchedules", "list"]),
    openapi({
      method: "GET",
      path: "/offering-schedules",
      summary: "List offering schedules",
      tags: ["Offering schedules"],
    }),
  )
  .input(
    v.object({
      ...listInputSchema.entries,
      offeringId: uuidSchema,
      filters: v.optional(
        v.object({
          dayOfWeek: v.optional(v.number()),
          isActive: v.optional(v.boolean()),
        }),
      ),
    }),
  )
  .output(
    v.object({
      items: v.array(offeringScheduleListItemSchema),
      ...paginationSchema.entries,
    }),
  );

export const getById = oc
  .meta(
    meta.path(["offeringSchedules", "getById"]),
    openapi({
      method: "GET",
      path: "/offering-schedules/{id}",
      summary: "Get an offering schedule by id",
      tags: ["Offering schedules"],
    }),
  )
  .input(idInputSchema)
  .output(v.nullable(offeringScheduleDetailSchema));

export const create = oc
  .meta(
    meta.path(["offeringSchedules", "create"]),
    openapi({
      method: "POST",
      path: "/offering-schedules",
      summary: "Create an offering schedule",
      tags: ["Offering schedules"],
    }),
  )
  .input(createOfferingScheduleInputSchema)
  .output(offeringScheduleSchema);

export const update = oc
  .meta(
    meta.path(["offeringSchedules", "update"]),
    openapi({
      method: "PATCH",
      path: "/offering-schedules/{id}",
      summary: "Update an offering schedule",
      tags: ["Offering schedules"],
    }),
  )
  .input(
    v.object({
      id: uuidSchema,
      data: v.partial(v.omit(createOfferingScheduleInputSchema, ["offeringId"])),
    }),
  )
  .output(offeringScheduleSchema);

export const deleteOfferingSchedule = oc
  .meta(
    meta.path(["offeringSchedules", "delete"]),
    openapi({
      method: "DELETE",
      path: "/offering-schedules/{id}",
      summary: "Delete an offering schedule",
      tags: ["Offering schedules"],
    }),
  )
  .input(idInputSchema)
  .output(offeringScheduleSchema);

export const offeringSchedules = {
  list,
  getById,
  create,
  update,
  delete: deleteOfferingSchedule,
};
