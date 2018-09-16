import * as glob from 'glob';
import * as cli from './index';
import { AdminCommand } from './testFixtures/commands/admin';
import { LoginCommand } from './testFixtures/commands/login';
import { LogoutCommand } from './testFixtures/commands/logout';

jest.mock('glob');

describe('Functional Tests', () => {
  describe('when loading commands from directory and theres an error', () => {
    beforeEach(() => (glob as any as jest.Mock<{}>).mockImplementation((_pattern, callback) => {
      callback(new Error('Computer says no'));
    }));

    afterEach(() => jest.restoreAllMocks());

    it('should reject', async () => {
      await expect(cli.commandsFromDirectory('some path')).rejects.toEqual(new Error('Computer says no'));
    });
  });

  it('should allow getting command usage', () => {
    expect(cli.getCommandUsageString(LoginCommand)).toEqual('login <username> [password]');
    expect(cli.getCommandUsageString(LogoutCommand)).toEqual('logout');
    expect(cli.getCommandUsageString(AdminCommand)).toEqual('admin');
  });
});
