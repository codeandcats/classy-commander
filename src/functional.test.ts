import * as commander from 'commander';
import * as fs from 'fs-extra';
import { Container, injectable } from 'inversify';
import { command } from './decorators';
import * as cli from './index';
import { Command, option, value } from './index';

const noop = () => {
  //
};

@injectable()
export class Logger {
  log(...args: any[]) {
    // console.log(...args);
  }

  error(...args: any[]) {
    // console.error(...args);
  }
}

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

class LogoutCommandParams {
}

@command('logout', LogoutCommandParams)
@injectable()
class LogoutCommand implements Command<LogoutCommandParams> {
  constructor(private auth: AuthService) {
  }

  execute() {
    this.auth.logout();
  }
}

@injectable()
class AdminService {
  someAdminFunction() {
    throw new Error('Not authorised');
  }
}

class AdminCommandParams {
}

@command('admin', AdminCommandParams)
@injectable()
class AdminCommand implements Command<AdminCommandParams> {
  constructor(private admin: AdminService) {
  }

  execute() {
    this.admin.someAdminFunction();
  }
}

describe('Functional Test', () => {
  let auth: AuthService;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(noop);
    jest.spyOn(process, 'exit').mockImplementation(noop);

    auth = new AuthService(new Logger());
    jest.spyOn(auth, 'login');
    jest.spyOn(auth, 'logout');

    const container = new Container({ autoBindInjectable: true });
    container.bind(AuthService).toConstantValue(auth);

    cli.ioc(container);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should execute a command', async () => {
    await cli.execute(['', '', 'login', 'john', 'swordfish', '--rememberMeFor', '30']);

    expect(auth.login).toHaveBeenCalledWith('john', 'swordfish', 30);
  });

  it('should execute another command', async () => {
    await cli.execute(['', '', 'logout']);

    expect(auth.logout).toHaveBeenCalled();
  });

  it('should allow manually specifying version and log it when asked for it', async () => {
    jest.spyOn(fs, 'pathExistsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readJSONSync').mockReturnValue({ version: '9.9.9' });
    jest.spyOn(process.stdout, 'write').mockImplementation();

    await cli
      .version('6.6.6')
      .execute(['', '', '--version']);

    // tslint:disable-next-line:no-console
    expect(process.stdout.write).toHaveBeenCalledWith('6.6.6\n');
  });

  it('should grab version from package.json and logs it when asking for version', async () => {
    jest.spyOn(fs, 'pathExistsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readJSONSync').mockReturnValue({ version: '9.9.9' });
    jest.spyOn(process.stdout, 'write').mockImplementation();

    await cli
      .versionFromPackage('some_folder')
      .execute(['', '', '--version']);

    // tslint:disable-next-line:no-console
    expect(process.stdout.write).toHaveBeenCalledWith('9.9.9\n');
  });

  it('should error when trying to load version from package.json and it is not found', () => {
    expect(() => cli.versionFromPackage('some folder that does not exist')).toThrow(
      'Could not find package.json to load version from'
    );
  });

  it('should return usage if not supplied any args', async () => {
    jest.spyOn(commander, 'help').mockImplementation(noop);

    await cli.execute(['', '']);

    expect(commander.help).toHaveBeenCalled();
  });

  describe('when not explicitly providing args', () => {
    let originalProcessArgs: string[] | undefined;

    beforeEach(() => {
      originalProcessArgs = process.argv;
      process.argv = ['', '', 'login', 'john', 'swordfish'];
    });

    afterEach(() => {
      process.argv = originalProcessArgs!;
    });

    it('should get args from process.argv', async () => {
      await cli.execute();
      expect(auth.login).toHaveBeenCalledTimes(1);
    });
  });

  it('should log errors and exit', async () => {
    await cli.execute(['', '', 'admin']);

    // tslint:disable-next-line:no-console
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Not authorised/i));
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should allow getting command usage', () => {
    expect(cli.getCommandUsageString(LoginCommand)).toEqual('login <username> [password]');
    expect(cli.getCommandUsageString(LogoutCommand)).toEqual('logout');
    expect(cli.getCommandUsageString(AdminCommand)).toEqual('admin');
  });
});
