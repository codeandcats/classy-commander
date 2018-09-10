import * as meta from './metadata';
import { CommandOptionDefinitionOptions } from './types';

export const command = (name: string, paramsClass: { new(): {} }, description?: string) => (target: any) => {
  meta.addCommand({ name, type: target, paramsClass, description });
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
