import { injectable } from 'inversify';
import { Command, command, option, value } from '../../index';
import { AuthService } from '../services/auth';

export class LoginCommandParams {
  @value()
  username: string = '';

  @value({ optional: true })
  password?: string;

  @option({ description: 'Keeps session alive', valueName: 'days' })
  rememberMeFor: number = 1;
}

@command('login', LoginCommandParams)
@injectable()
export class LoginCommand implements Command<LoginCommandParams> {
  constructor(private auth: AuthService) {
  }

  execute(params: LoginCommandParams) {
    this.auth.login(params.username, params.password, params.rememberMeFor);
  }
}
