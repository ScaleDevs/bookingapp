import { meta, oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import * as v from "valibot";

import {
  idInputSchema,
  listInputSchema,
  normalizedStringSchema,
  paginationSchema,
  uuidSchema,
} from "../shared/schema";
import {
  blockedTimeDetailSchema,
  blockedTimeListItemSchema,
  blockedTimeSchema,
  createBlockedTimeInputSchema,
} from "./schema";

export const list = oc
  .meta(
    meta.path(["blockedTimes", "list"]),
    openapi({
      method: "GET",
      path: "/blocked-times",
      summary: "List blocked times",
      tags: ["Blocked times"],
    }),
  )
  .input(
    v.object({
      ...listInputSchema.entries,
      offeringId: uuidSchema,
      filters: v.optional(
        v.object({
          reason: v.optional(normalizedStringSchema),
          dateFrom: v.optional(v.date()),
          dateTo: v.optional(v.date()),
        }),
      ),
    }),
  )
  .output(
    v.object({
      items: v.array(blockedTimeListItemSchema),
      ...paginationSchema.entries,
    }),
  );

export const getById = oc
  .meta(
    meta.path(["blockedTimes", "getById"]),
    openapi({
      method: "GET",
      path: "/blocked-times/{id}",
      summary: "Get a blocked time by id",
      tags: ["Blocked times"],
    }),
  )
  .input(idInputSchema)
  .output(v.nullable(blockedTimeDetailSchema));

export const create = oc
  .meta(
    meta.path(["blockedTimes", "create"]),
    openapi({
      method: "POST",
      path: "/blocked-times",
      summary: "Create a blocked time",
      tags: ["Blocked times"],
    }),
  )
  .input(createBlockedTimeInputSchema)
  .output(blockedTimeSchema);

export const update = oc
  .meta(
    meta.path(["blockedTimes", "update"]),
    openapi({
      method: "PATCH",
      path: "/blocked-times/{id}",
      summary: "Update a blocked time",
      tags: ["Blocked times"],
    }),
  )
  .input(
    v.object({
      id: uuidSchema,
      data: v.partial(
        v.object({
          startsAt: v.date(),
          endsAt: v.date(),
          reason: v.optional(v.nullable(v.string())),
        }),
      ),
    }),
  )
  .output(blockedTimeSchema);

export const deleteBlockedTime = oc
  .meta(
    meta.path(["blockedTimes", "delete"]),
    openapi({
      method: "DELETE",
      path: "/blocked-times/{id}",
      summary: "Delete a blocked time",
      tags: ["Blocked times"],
    }),
  )
  .input(idInputSchema)
  .output(blockedTimeSchema);

export const blockedTimes = {
  list,
  getById,
  create,
  update,
  delete: deleteBlockedTime,
};
