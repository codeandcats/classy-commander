import { injectable } from 'inversify';
import { Command, command } from '../../index';
import { AuthService } from '../services/auth';

export class LogoutCommandParams {
}

@command('logout', LogoutCommandParams)
@injectable()
export class LogoutCommand implements Command<LogoutCommandParams> {
  constructor(private auth: AuthService) {
  }

  execute() {
    this.auth.logout();
  }
}
