import { boolean as parseBoolean } from 'boolean';

export function coerceValue(
  value: string | string[] | undefined,
  toType: typeof String | typeof Number | typeof Boolean,
  defaultValue: string | number | boolean | undefined | string[] | number[] | boolean[]
): string | number | boolean | undefined | string[] | number[] | boolean[] {
  if (value === undefined) {
    return defaultValue;
  }

  if (value instanceof Array) {
    return value.map((v) => coerceValue(v, toType, undefined)) as string[] | number[] | boolean[];
  }

  if (toType === Number) {
    return +value;
  } else if (toType === Boolean) {
    return parseBoolean(value);
  } else {
    return value;
  }
}
