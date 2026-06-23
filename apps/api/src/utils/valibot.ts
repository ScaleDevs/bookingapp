import * as v from 'valibot';

/** Collapses runs of whitespace to a single space and trims leading/trailing space. */
export const normalizeWhitespace = (value: string): string =>
    value.split(/\s+/).filter(Boolean).join(' ').trim();

/** Valibot string schema that normalizes whitespace between words. */
export const normalizedString = v.pipe(v.string(), v.transform(normalizeWhitespace));

/** UUID string schema. */
export const uuidString = v.pipe(v.string(), v.uuid());

/** Coerces string, number, or Date inputs to a Date instance. */
export const coerceDate = v.pipe(
    v.unknown(),
    v.transform((value) => new Date(value as string | number | Date)),
    v.date(),
);
