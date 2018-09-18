import { registerCommand } from './commander';
import * as meta from './metadata';
import { CommandClass, CommandOptionDefinitionOptions } from './types';
import { CommandParamsClass } from './types';

export const command = <TParams>(
  name: string,
  paramsClass: CommandParamsClass<TParams>,
  description?: string
) => {
  return (target: CommandClass<TParams>) => {
    registerCommand({
      name,
      description,
      type: target,
      paramsClass,
    });
  };
};

export const option = (options?: CommandOptionDefinitionOptions) => (target: any, name: string) => {
  meta.addCommandOption(target, name, options);
};

export interface ValueOptions {
  optional?: boolean;
  variadic?: { type: typeof String | typeof Number | typeof Boolean };
}

export const value = (options?: ValueOptions) => (target: any, name: string) => {
  meta.addCommandValue({
    name,
    paramsClassPrototype: target,
    optional: !!(options && options.optional),
    variadicType: options && options.variadic && options.variadic.type
  });
};
