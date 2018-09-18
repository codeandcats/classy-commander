import 'reflect-metadata';

import { CommandOptionDefinition } from '../dist/types';
import { addCommandOption, addCommandValue, getCommandOptions, getCommandValues, metadataKeys } from './metadata';
import { CommandValueDefinition } from './types';

class LoginCommandParams {
  username: string = '';
  password?: string;
  rememberMeFor?: number;
  mfaCode?: number;
}

class AddCommandParams {
  values: number[] = [];
  precisions: number[] = [];
}

describe('src/metadata', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCommandValues', () => {
    it('should return values registered with Reflect API', () => {
      const values: CommandValueDefinition[] = [{
        name: 'username',
        optional: false,
        type: String,
        variadic: false
      }];

      jest.spyOn(Reflect, 'getOwnMetadata').mockReturnValue(values);

      const result = getCommandValues(LoginCommandParams.prototype);

      expect(result).toEqual(values);
      expect(Reflect.getOwnMetadata).toHaveBeenCalledWith(metadataKeys.values, LoginCommandParams.prototype);
    });

    it('should return an empty array when no values registered with Reflect API', () => {
      jest.spyOn(Reflect, 'getOwnMetadata').mockReturnValue(undefined);

      const result = getCommandValues(LoginCommandParams.prototype);

      expect(result).toEqual([]);

      expect(Reflect.getOwnMetadata).toHaveBeenCalledWith(metadataKeys.values, LoginCommandParams.prototype);
    });
  });

  describe('addCommandValue', () => {
    it('should register value using Reflect API', () => {
      jest.spyOn(Reflect, 'getMetadata').mockReturnValue(String);
      jest.spyOn(Reflect, 'getOwnMetadata').mockReturnValue([
        {
          name: 'username',
          optional: false,
          type: String
        }
      ]);
      jest.spyOn(Reflect, 'defineMetadata');

      addCommandValue({
        name: 'password',
        optional: true,
        paramsClassPrototype: LoginCommandParams.prototype,
        variadicType: undefined
      });

      expect(Reflect.getMetadata).toHaveBeenCalledWith('design:type', LoginCommandParams.prototype, 'password');
      expect(Reflect.getOwnMetadata).toHaveBeenCalledWith(metadataKeys.values, LoginCommandParams.prototype);
      expect(Reflect.defineMetadata).toHaveBeenCalledWith(
        metadataKeys.values,
        [
          {
            name: 'username',
            optional: false,
            type: String
          },
          {
            name: 'password',
            optional: true,
            type: String,
            variadic: false
          }
        ],
        LoginCommandParams.prototype
      );
    });

    it('should error when trying to register more than one variadic value per command', () => {
      jest.spyOn(Reflect, 'getMetadata').mockReturnValue(Number);
      jest.spyOn(Reflect, 'getOwnMetadata')
        .mockReturnValueOnce([])
        .mockReturnValueOnce([
          {
            name: 'values',
            optional: false,
            type: Number,
            variadic: true
          }
        ]);
      jest.spyOn(Reflect, 'defineMetadata');

      addCommandValue({
        name: 'values',
        optional: false,
        paramsClassPrototype: AddCommandParams.prototype,
        variadicType: Number
      });

      expect(() => addCommandValue({
        name: 'precisions',
        optional: false,
        paramsClassPrototype: AddCommandParams.prototype,
        variadicType: Number
      })).toThrowError(new Error('Command can have only one variadic value'));
    });
  });

  describe('getCommandOptions', () => {
    it('should return options registered with Reflect API', () => {
      const options: CommandOptionDefinition[] = [{
        name: 'rememberMeFor',
        type: Number,
        description: 'How many days to keep user logged in for',
        shortName: 'r',
        valueName: 'days'
      }];

      jest.spyOn(Reflect, 'getOwnMetadata').mockReturnValue(options);

      const result = getCommandOptions(LoginCommandParams.prototype);

      expect(result).toEqual(options);
      expect(Reflect.getOwnMetadata).toHaveBeenCalledWith(metadataKeys.options, LoginCommandParams.prototype);
    });

    it('should return an empty array when no options registered with Reflect API', () => {
      jest.spyOn(Reflect, 'getOwnMetadata').mockReturnValue(undefined);

      const result = getCommandOptions(LoginCommandParams.prototype);

      expect(result).toEqual([]);

      expect(Reflect.getOwnMetadata).toHaveBeenCalledWith(metadataKeys.options, LoginCommandParams.prototype);
    });
  });

  describe('addCommandOption', () => {
    it('should register option using Reflect API', () => {
      jest.spyOn(Reflect, 'getMetadata').mockReturnValue(Number);
      jest.spyOn(Reflect, 'getOwnMetadata').mockReturnValue([
        {
          name: 'username',
          type: Number,
          description: 'How many days to keep user logged in for',
          shortName: 'r',
          valueName: 'days'
        }
      ] as CommandOptionDefinition[]);
      jest.spyOn(Reflect, 'defineMetadata');

      addCommandOption(LoginCommandParams.prototype, 'mfaCode', {
        description: 'Multi-factor Authentication Code',
        valueName: 'code'
      });

      expect(Reflect.getMetadata).toHaveBeenCalledWith('design:type', LoginCommandParams.prototype, 'mfaCode');
      expect(Reflect.getOwnMetadata).toHaveBeenCalledWith(metadataKeys.options, LoginCommandParams.prototype);
      expect(Reflect.defineMetadata).toHaveBeenCalledWith(
        metadataKeys.options,
        [
          {
            name: 'username',
            type: Number,
            description: 'How many days to keep user logged in for',
            shortName: 'r',
            valueName: 'days'
          },
          {
            name: 'mfaCode',
            type: Number,
            description: 'Multi-factor Authentication Code',
            valueName: 'code'
          }
        ],
        LoginCommandParams.prototype
      );
    });
  });
});
