import { injectable } from 'inversify';
import { Command, command, option, value } from '../../src';
import { Calculator } from '../services/calculator';

export class SubtractCommandParams {
  @value({ variadic: { type: Number } })
  values: number[] = [];

  @option({ shortName: 't' })
  thousandSeparators: boolean = false;

  @option({ shortName: 'd', valueName: 'count' })
  decimalPlaces: number = 0;
}

@command('subtract', SubtractCommandParams)
@injectable()
export class SubtractCommand implements Command<SubtractCommandParams> {
  constructor(private calculator: Calculator) {
  }

  // tslint:disable:no-console
  async execute(params: SubtractCommandParams) {
    const { values, thousandSeparators, decimalPlaces } = params;

    const result = this.calculator.subtract(...values);

    const format = (val: number) => val.toLocaleString(undefined, {
      useGrouping: thousandSeparators,
      maximumFractionDigits: decimalPlaces
    });

    console.log(`${values.map((val) => format(val)).join(' + ')} = ${format(result)}`);
  }
  // tslint:enable:no-console

}
