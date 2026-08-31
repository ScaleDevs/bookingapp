import { meta, oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import * as v from "valibot";

import { idInputSchema, emptyInputSchema, listInputSchema, paginationSchema, normalizedStringSchema } from "../shared/schema";
import {
  createOfferingInputSchema,
  offeringListItemSchema,
  offeringSchema,
  offeringSelectOptionSchema,
} from "./schema";

export const list = oc
  .meta(
    meta.path(["offerings", "list"]),
    openapi({
      method: "GET",
      path: "/offerings",
      summary: "List offerings",
      tags: ["Offerings"],
    }),
  )
  .input(
    v.object({
      ...listInputSchema.entries,
      filters: v.optional(
        v.object({
          name: v.optional(normalizedStringSchema),
          isActive: v.optional(v.boolean()),
        }),
      ),
    }),
  )
  .output(
    v.object({
      items: v.array(offeringListItemSchema),
      ...paginationSchema.entries,
    }),
  );

export const getById = oc
  .meta(
    meta.path(["offerings", "getById"]),
    openapi({
      method: "GET",
      path: "/offerings/{id}",
      summary: "Get an offering by id",
      tags: ["Offerings"],
    }),
  )
  .input(idInputSchema)
  .output(v.nullable(offeringSchema));

export const getSelectOptions = oc
  .meta(
    meta.path(["offerings", "getSelectOptions"]),
    openapi({
      method: "GET",
      path: "/offerings/select-options",
      summary: "Get offering select options",
      tags: ["Offerings"],
    }),
  )
  .input(emptyInputSchema)
  .output(v.array(offeringSelectOptionSchema));

export const create = oc
  .meta(
    meta.path(["offerings", "create"]),
    openapi({
      method: "POST",
      path: "/offerings",
      summary: "Create an offering",
      tags: ["Offerings"],
    }),
  )
  .input(createOfferingInputSchema)
  .output(offeringSchema);

export const update = oc
  .meta(
    meta.path(["offerings", "update"]),
    openapi({
      method: "PATCH",
      path: "/offerings/{id}",
      summary: "Update an offering",
      tags: ["Offerings"],
    }),
  )
  .input(v.object({ id: idInputSchema.entries.id, data: v.partial(createOfferingInputSchema) }))
  .output(offeringSchema);

export const deleteOffering = oc
  .meta(
    meta.path(["offerings", "delete"]),
    openapi({
      method: "DELETE",
      path: "/offerings/{id}",
      summary: "Delete an offering",
      tags: ["Offerings"],
    }),
  )
  .input(idInputSchema)
  .output(offeringSchema);

export const toggleStatus = oc
  .meta(
    meta.path(["offerings", "toggleStatus"]),
    openapi({
      method: "POST",
      path: "/offerings/{id}/toggle-status",
      summary: "Toggle offering active status",
      tags: ["Offerings"],
    }),
  )
  .input(idInputSchema)
  .output(offeringSchema);

export const offerings = {
  list,
  getById,
  getSelectOptions,
  create,
  update,
  delete: deleteOffering,
  toggleStatus,
};
