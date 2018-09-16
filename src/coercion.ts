import * as parseBoolean from 'boolean';

export function coerceValue(value: string, toType: typeof String): string;
export function coerceValue(value: string, toType: typeof Number): number;
export function coerceValue(value: string, toType: typeof Boolean): boolean;

export function coerceValue(
  value: string,
  toType: typeof String | typeof Number | typeof Boolean,
): string | number | boolean {
  if (toType === Number) {
    return +value;
  } else if (toType === Boolean) {
    return parseBoolean(value);
  } else {
    return value;
  }
}
