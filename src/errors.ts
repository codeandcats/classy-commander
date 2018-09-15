export function errorToString(err: Error | string | any): string {
  return err.stack || err.message || `${err}`;
}
