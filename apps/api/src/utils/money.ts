import Decimal from 'decimal.js';

export type MoneyValue = string | number | Decimal;

/** Decimal.js for monetary precision */
export function toMoney(value: MoneyValue): Decimal {
    if (value instanceof Decimal) {
        return value;
    }
    return new Decimal(value);
}

/** Decimal.js for monetary precision */
export const moneyZero = toMoney(0);
