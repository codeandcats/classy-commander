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

export const option = (options?: CommandOptionDefinitionOptions) => ((target: any, name: string) => {
  meta.addCommandOption(target, name, options);
});

export const value = (options?: { optional?: boolean }) => ((target: any, name: string) => {
  meta.addCommandValue(target, {
    name,
    optional: !!(options && options.optional)
  });
});
