import { meta, oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import * as v from "valibot";

import { emptyInputSchema, idInputSchema, uuidSchema } from "../shared/schema";
import { createCustomerInputSchema, customerSchema } from "./schema";

export const list = oc
  .meta(
    meta.path(["customers", "list"]),
    openapi({
      method: "GET",
      path: "/customers",
      summary: "List customers",
      tags: ["Customers"],
    }),
  )
  .input(emptyInputSchema)
  .output(v.array(customerSchema));

export const getById = oc
  .meta(
    meta.path(["customers", "getById"]),
    openapi({
      method: "GET",
      path: "/customers/{id}",
      summary: "Get a customer by id",
      tags: ["Customers"],
    }),
  )
  .input(idInputSchema)
  .output(v.nullable(customerSchema));

export const create = oc
  .meta(
    meta.path(["customers", "create"]),
    openapi({
      method: "POST",
      path: "/customers",
      summary: "Create a customer",
      tags: ["Customers"],
    }),
  )
  .input(createCustomerInputSchema)
  .output(customerSchema);

export const update = oc
  .meta(
    meta.path(["customers", "update"]),
    openapi({
      method: "PATCH",
      path: "/customers/{id}",
      summary: "Update a customer",
      tags: ["Customers"],
    }),
  )
  .input(
    v.object({
      id: uuidSchema,
      data: v.partial(createCustomerInputSchema),
    }),
  )
  .output(customerSchema);

export const deleteCustomer = oc
  .meta(
    meta.path(["customers", "delete"]),
    openapi({
      method: "DELETE",
      path: "/customers/{id}",
      summary: "Delete a customer",
      tags: ["Customers"],
    }),
  )
  .input(idInputSchema)
  .output(customerSchema);

export const customers = {
  list,
  getById,
  create,
  update,
  delete: deleteCustomer,
};
