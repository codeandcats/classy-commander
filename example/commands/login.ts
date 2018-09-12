// tslint:disable:no-console
import { Command, command, option, value } from '../../src';

export class LoginParams {
  @value()
  username: string = '';

  @value({ optional: true })
  password: string = '';

  @option({ valueName: 'days', description: 'Number of days to keep user logged in for' })
  rememberMeFor: number = 1;
}

@command('login', LoginParams)
export class LoginCommand implements Command<LoginParams> {
  async execute(params: LoginParams) {
    if (params.username.toLowerCase() !== 'guest') {
      if (params.password !== 'Password123') {
        return console.error('Password incorrect');
      }
    }

    console.log(`Authenticated. Welcome ${params.username}`);

    if (params.rememberMeFor) {
      console.log(`Session will be kept alive for ${params.rememberMeFor} days`);
    }
  }
}
