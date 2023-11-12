import * as commander from 'commander';
import * as fs from 'fs-extra';
import { Container } from 'inversify';
import * as path from 'path';
import * as cli from './index';
import { AuthService } from './testFixtures/services/auth';
import { Logger } from './testFixtures/services/logger';

describe('Functional Tests', () => {
  let auth: AuthService;
  let logger: Logger;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(process, 'exit').mockImplementation();
    jest.spyOn(commander.program, 'outputHelp').mockImplementation();

    logger = new Logger();
    jest.spyOn(logger, 'log');
    jest.spyOn(logger, 'error');

    auth = new AuthService(logger);
    jest.spyOn(auth, 'login');
    jest.spyOn(auth, 'logout');

    const container = new Container({ autoBindInjectable: true });
    container.bind(AuthService).toConstantValue(auth);

    cli.ioc(container);

    await cli.commandsFromDirectory(path.join(__dirname, 'testFixtures', 'commands'));
  });

  afterEach(() => {
    process.exitCode = 0;
    jest.restoreAllMocks();
  });

  it('should execute a command', async () => {
    let resolved = false;

    const promise = cli
      .execute(['', '', 'login', 'john', 'swordfish', '--rememberMeFor', '30'])
      .then(() => resolved = true);

    expect(auth.login).toHaveBeenCalledWith('john', 'swordfish', 30);
    expect(resolved).toBe(false);

    await promise;

    expect(resolved).toBe(true);
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
    jest.spyOn(commander.program, 'outputHelp').mockImplementation();

    await cli.execute(['', '']);

    expect(commander.program.outputHelp).toHaveBeenCalled();
  });

  it('should show usage if supplied a command that does not exist', async () => {
    await cli.execute(['', '', 'find-prime-factors', '1290833']);

    // tslint:disable-next-line:no-console
    expect(console.error).toHaveBeenCalledWith(
      'Invalid command: %s\nSee --help for a list of available commands.',
      'find-prime-factors 1290833'
    );
    expect(process.exitCode).toBe(1);
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

  it('should log errors and set exit code', async () => {
    await expect(() => cli.execute(['', '', 'admin'])).rejects.toThrow('Not authorised');

    // tslint:disable-next-line:no-console
    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/Not authorised/i));
    expect(process.exitCode).toBe(1);
  });
});
