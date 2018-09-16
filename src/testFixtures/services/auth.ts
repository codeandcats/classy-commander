import { injectable } from 'inversify';
import { Logger } from './logger';

@injectable()
export class AuthService {
  constructor(private logger: Logger) {
  }

  login(username: string, password: string | undefined, keepAliveDurationDays: number) {
    if (password === 'swordfish' || (username === 'guest' && !password)) {
      this.logger.log(`User authenticated`);
      return;
    }

    this.logger.error('Incorrect username and password combination');
  }

  logout() {
    this.logger.log('Logged out');
  }
}
