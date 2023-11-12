import { injectable } from 'inversify';
import { Command, command, option, value } from '../../src';
import { Calculator } from '../services/calculator';

export class DivideCommandParams {
  @value()
  amount!: number;

  @value()
  divisor!: number;

  @option({ shortName: 't' })
  thousandSeparators: boolean = false;

  @option({ shortName: 'd', valueName: 'count' })
  decimalPlaces: number = 0;
}

@command('divide', DivideCommandParams)
@injectable()
export class DivideCommand implements Command<DivideCommandParams> {
  constructor(private calculator: Calculator) {
  }

  // tslint:disable:no-console
  execute(params: DivideCommandParams) {
    const { amount, divisor, thousandSeparators, decimalPlaces } = params;

    const result = this.calculator.divide(amount, divisor);

    const format = (val: number) => val.toLocaleString(undefined, {
      useGrouping: thousandSeparators,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });

    console.log(`${format(amount)} / ${format(divisor)} = ${format(result)}`);
  }
  // tslint:enable:no-console
}
