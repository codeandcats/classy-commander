// tslint:disable:no-console
import { Command, command, value } from '../../src';

export class GreetParams {
  @value()
  name: string = '';
}

@command('greet', GreetParams)
export class Greet implements Command<GreetParams> {
  async execute(params: GreetParams) {
    console.log(`Hello ${params.name}`);
  }
}
