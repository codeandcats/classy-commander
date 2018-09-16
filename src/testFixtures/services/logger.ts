import { injectable } from 'inversify';

@injectable()
export class Logger {
  log(...args: any[]) {
    // console.log(...args);
  }

  error(...args: any[]) {
    // console.error(...args);
  }
}
