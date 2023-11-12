import * as commander from 'commander';
import { partialOf } from 'jest-helpers';
import { getCommandUsage, getIocContainer, registerCommand, setIocContainer } from './commander';
import { option, value } from './decorators';
import { Command, CommandDefinition, IocContainer } from './types';

type CommanderCommand = typeof commander.program.command;

jest.mock('commander');

const noop = () => {
  //
};

describe('src/commander', () => {
  let loginHandler: (params: LoginCommandParams) => void | undefined;

  class LoginCommandParams {
    @value()
    username: string = '';

    @value({ optional: true })
    password?: string;

    @option({ shortName: 'r', description: 'Keeps user session alive for number of days', valueName: 'days' })
    rememberMeFor?: number = 7;

    @option({ valueName: 'code' })
    mfaCode?: string;

    @option({ valueName: 'pin' })
    pin?: number;

    @option()
    sudo?: boolean;
  }

  class LoginCommand implements Command<LoginCommandParams> {
    async execute(params: LoginCommandParams) {
      loginHandler(params);
    }
  }

  class AddCommandParams {
    @value()
    base10: boolean = true;

    @value({ variadic: { type: Number } })
    values: number[] = [];

    @value()
    zeroResultOnError: boolean = false;
  }

  class AddCommand {
    execute(params: AddCommandParams) {
      //
    }
  }

  beforeEach(() => {
    loginHandler = jest.fn();
    jest.spyOn(process, 'exit').mockImplementation(noop as () => never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('setIocContainer', () => {
    afterEach(() => setIocContainer(undefined));

    it('should set the ioc container to use when instantiating commands', () => {
      const container: IocContainer = { get: () => null as any };
      setIocContainer(container);
      expect(getIocContainer()).toEqual(container);
    });
  });

  describe('registerCommand', () => {
    let command: CommandDefinition<any>;
    let commanderCommandMock: ReturnType<typeof commander.program.command>;
    let action: (...args: any[]) => void | undefined;

    beforeEach(() => {
      command = {
        name: 'login',
        description: 'Logs user in',
        paramsClass: LoginCommandParams,
        type: LoginCommand
      };

      commanderCommandMock = partialOf<ReturnType<CommanderCommand>>({
        action: jest.fn().mockImplementation((a) => action = a),
        description: jest.fn(),
        option: jest.fn()
      });

      jest.spyOn(commander.program, 'command').mockReturnValue(commanderCommandMock);

      registerCommand(command);
    });

    it('should register a command with commander', () => {
      expect(commander.program.command).toHaveBeenCalledWith('login <username> [password]');

      expect(commanderCommandMock.description).toHaveBeenCalledWith('Logs user in');

      expect(commanderCommandMock.action).toHaveBeenCalledWith(expect.any(Function));

      expect(commanderCommandMock.option).toHaveBeenCalledWith(
        '-r, --rememberMeFor <days>',
        'Keeps user session alive for number of days',
        expect.any(Function),
        7
      );

      expect(commanderCommandMock.option).toHaveBeenCalledWith(
        '--mfaCode <code>',
        '',
        expect.any(Function),
        undefined
      );

      const coerceRememberMeFor = (commanderCommandMock.option as unknown as jest.Mock<{}>).mock.calls[0][2];
      expect(coerceRememberMeFor('123')).toEqual(123);

      const coerceMfaCode = (commanderCommandMock.option as unknown as jest.Mock<{}>).mock.calls[1][2];
      expect(coerceMfaCode('123')).toEqual('123');

      const coercePin = (commanderCommandMock.option as unknown as jest.Mock<{}>).mock.calls[2][2];
      expect(coercePin('123')).toEqual(123);
    });

    it('should register an action that executes the command', () => {
      expect(action).toBeDefined();
      action('john', undefined, { pin: 8008, rememberMeFor: 3, mfaCode: 'abcdef' });
      expect(loginHandler).toHaveBeenCalledWith({ username: 'john', password: undefined, pin: 8008, rememberMeFor: 3, mfaCode: 'abcdef' });
    });

    it('should register an action that executes the command and bubbles errors up', async () => {
      jest.spyOn(console, 'error').mockImplementation(noop);
      (loginHandler as unknown as jest.Mock<{}>).mockImplementation(() => {
        throw new Error('Computer says no');
      });
      expect(action).toBeDefined();
      await expect(action('john', undefined, {})).rejects.toEqual(new Error('Computer says no'));
      expect(loginHandler).toHaveBeenCalledWith({ username: 'john', rememberMeFor: 7 });
    });
  });

  describe('getCommandUsage', () => {
    it('should return usage for a registered command', () => {
      const command: CommandDefinition<any> = {
        name: 'login',
        description: 'Logs user in',
        paramsClass: LoginCommandParams,
        type: LoginCommand
      };

      registerCommand(command);

      const usage = getCommandUsage(LoginCommand);

      expect(usage).toEqual('login <username> [password]');
    });

    it('should throw an error when command is unknown', () => {
      class NotACommand { }
      expect(() => getCommandUsage(NotACommand as any)).toThrowError(new Error('Class is not a command'));
    });
  });

  it('should return usage for a registered command with a variadic value', () => {
    const command: CommandDefinition<any> = {
      name: 'add',
      description: 'Adds two or more numbers',
      paramsClass: AddCommandParams,
      type: AddCommand
    };

    registerCommand(command);

    const usage = getCommandUsage(AddCommand);

    expect(usage).toEqual('add <base10> <zeroResultOnError> <values...>');
  });

  it('should throw an error when command is unknown', () => {
    class NotACommand { }
    expect(() => getCommandUsage(NotACommand as any)).toThrowError(new Error('Class is not a command'));
  });
});
