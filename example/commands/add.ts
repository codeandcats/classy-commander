import { injectable } from 'inversify';
import { Command, command, option, value } from '../../src';
import { Calculator } from '../services/calculator';

export class AddCommandParams {
  @value({ variadic: { type: Number } })
  values: number[] = [];

  @option({ shortName: 't' })
  thousandSeparators: boolean = false;

  @option({ shortName: 'd', valueName: 'count' })
  decimalPlaces: number = 0;
}

@command('add', AddCommandParams)
@injectable()
export class AddCommand implements Command<AddCommandParams> {
  constructor(private calculator: Calculator) {
  }

  // tslint:disable:no-console
  async execute(params: AddCommandParams) {
    const { values, thousandSeparators, decimalPlaces } = params;

    const result = this.calculator.add(...values);

    const format = (val: number) => val.toLocaleString(undefined, {
      useGrouping: thousandSeparators,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });

    console.log(`${values.map((val) => format(val)).join(' + ')} = ${format(result)}`);
  }
  // tslint:enable:no-console

}
