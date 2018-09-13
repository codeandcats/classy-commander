import { registerCommand } from './commander';
import { command, option, value } from './decorators';
import { addCommandOption, addCommandValue } from './metadata';
import { Command } from './types';

jest.mock('./commander');
jest.mock('./metadata');

class LoginCommandParams {
  username: string = '';
  password?: string;
  rememberMeFor?: number;
  mfaCode?: number;
}

class LoginCommand implements Command<LoginCommandParams> {
  async execute(params: LoginCommandParams) {
    //
  }
}

describe('src/decorators', () => {
  describe('command', () => {
    it('should return a decorator function that registers the command', () => {
      const result = command('login', LoginCommandParams, 'Logs user in');
      result(LoginCommand);

      expect(registerCommand).toHaveBeenCalledWith({
        name: 'login',
        description: 'Logs user in',
        type: LoginCommand,
        paramsClass: LoginCommandParams
      });
    });
  });

  describe('option', () => {
    it('should return a decorator function that registers the option', () => {
      const result = option({
        description: 'Keeps user logged in',
        shortName: 'r',
        valueName: 'days'
      });

      result(LoginCommandParams, 'rememberMeFor');

      expect(addCommandOption).toHaveBeenCalledWith(LoginCommandParams, 'rememberMeFor', {
        description: 'Keeps user logged in',
        shortName: 'r',
        valueName: 'days'
      });
    });
  });

  describe('value', () => {
    it('should return a decorator function that registers the value', () => {
      const result = value({
        optional: true
      });

      result(LoginCommandParams, 'password');

      expect(addCommandValue).toHaveBeenCalledWith(LoginCommandParams, {
        name: 'password',
        optional: true
      });
    });

    it('should default optional to false', () => {
      const result = value();

      result(LoginCommandParams, 'password');

      expect(addCommandValue).toHaveBeenCalledWith(LoginCommandParams, {
        name: 'password',
        optional: false
      });
    });
  });
});
