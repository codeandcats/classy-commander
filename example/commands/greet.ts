// tslint:disable:no-console
import { Command, command, value } from '../../src';

export class GreetCommandParams {
  @value()
  name: string = '';
}

@command('greet', GreetCommandParams)
export class GreetCommand implements Command<GreetCommandParams> {
  async execute(params: GreetCommandParams) {
    console.log(`Hello ${params.name}`);
  }
}
