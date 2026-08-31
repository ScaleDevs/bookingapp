import * as v from "valibot";

export const uuidSchema = v.pipe(v.string(), v.uuid());
export const nullableStringSchema = v.nullable(v.string());

export const normalizedStringSchema = v.pipe(
  v.string(),
  v.transform((value) => value.split(/\s+/).filter(Boolean).join(" ").trim()),
);

export const dateSchema = v.date();

export const paginationSchema = v.object({
  total: v.number(),
  page: v.number(),
  pageSize: v.number(),
  totalPages: v.number(),
});

export const listInputSchema = v.object({
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
  pageSize: v.optional(
    v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
    20,
  ),
  sortOrder: v.optional(v.picklist(["asc", "desc"]), "desc"),
});

export const idInputSchema = v.object({
  id: uuidSchema,
});

export const emptyInputSchema = v.object({});

export const healthSchema = v.object({
  status: v.literal("ok"),
  message: v.string(),
});
