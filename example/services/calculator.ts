import { injectable } from 'inversify';

@injectable()
export class Calculator {
  add(...amounts: number[]) {
    return amounts.reduce((total, amount) => total + amount, 0);
  }

  subtract(...amounts: number[]) {
    return amounts.reduce((total, amount) => total - amount, amounts.splice(0, 1)[0]);
  }
}
