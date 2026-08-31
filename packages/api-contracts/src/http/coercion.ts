import * as v from "valibot";

type NumberValidation = v.BaseValidation<
  number,
  number,
  v.BaseIssue<unknown>
>;

const stringToNumber = v.pipe(
  v.string(),
  v.transform(Number),
  v.check((value) => !Number.isNaN(value), "Invalid number"),
);

/**
 * Valibot schema helper for HTTP query/path parameters and form fields.
 *
 * Prefer oRPC Smart Coercion at the HTTP boundary when serving OpenAPI routes.
 */
export function httpNumber(...validations: NumberValidation[]) {
  return v.union([
    v.pipe(v.number(), ...validations),
    v.pipe(stringToNumber, ...validations),
  ]);
}

/** @see httpNumber */
export function httpInteger(...validations: NumberValidation[]) {
  return v.union([
    v.pipe(v.number(), v.integer(), ...validations),
    v.pipe(stringToNumber, v.integer(), ...validations),
  ]);
}

/** @see httpNumber */
export function httpBoolean(config?: v.ParseBooleanConfig) {
  return v.union([
    v.boolean(),
    v.pipe(v.string(), v.parseBoolean(config)),
  ]);
}

/** @see httpNumber */
export const httpDate = v.pipe(
  v.union([v.date(), v.string(), v.number()]),
  v.transform((value) => (value instanceof Date ? value : new Date(value))),
  v.check((value) => !Number.isNaN(value.getTime()), "Invalid date"),
);
