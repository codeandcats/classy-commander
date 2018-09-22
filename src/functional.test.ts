import * as commander from 'commander';
import * as fs from 'fs-extra';
import { Container } from 'inversify';
import * as path from 'path';
import * as cli from './index';
import { AuthService } from './testFixtures/services/auth';
import { Logger } from './testFixtures/services/logger';

const noop = () => {
  //
};

describe('Functional Tests', () => {
  let auth: AuthService;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(noop);
    jest.spyOn(process, 'exit').mockImplementation(noop);

    auth = new AuthService(new Logger());
    jest.spyOn(auth, 'login');
    jest.spyOn(auth, 'logout');

    const container = new Container({ autoBindInjectable: true });
    container.bind(AuthService).toConstantValue(auth);

    cli.ioc(container);

    await cli.commandsFromDirectory(path.join(__dirname, 'testFixtures', 'commands'));
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

  it('should show usage if not supplied any args', async () => {
    let modifiedHelp: string | undefined;

    const helpSpy = jest.spyOn(commander, 'help').mockImplementation((cb: (output: string) => string) => {
      modifiedHelp = cb('some help');
    });

    await cli.execute(['', '']);

    expect(commander.help).toHaveBeenCalled();

    expect(modifiedHelp).toEqual('some help\n');
  });

  it('should show usage if supplied a command that does not exist', () => {
    jest.spyOn(console, 'error').mockImplementation(noop);

    cli.execute(['', '', 'find-prime-factors', '1290833']);

    // tslint:disable-next-line:no-console
    expect(console.error).toHaveBeenCalledWith(
      'Invalid command: %s\nSee --help for a list of available commands.',
      'find-prime-factors 1290833'
    );
    expect(process.exit).toHaveBeenCalled();
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
});
