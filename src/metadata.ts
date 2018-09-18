import 'reflect-metadata';

import { CommandOptionDefinition, CommandOptionDefinitionOptions, CommandValueDefinition } from './types';

export const metadataKeys = Object.freeze({
  command: Symbol('command'),
  options: Symbol('options'),
  values: Symbol('values')
});

export function getCommandValues(paramsClassPrototype: any): CommandValueDefinition[] {
  return [...(Reflect.getOwnMetadata(metadataKeys.values, paramsClassPrototype) || [])];
}

export interface AddCommandValueOptions {
  paramsClassPrototype: any;
  name: string;
  optional: boolean;
  variadicType: typeof String | typeof Number | typeof Boolean | undefined;
}

export function addCommandValue(options: AddCommandValueOptions) {
  const { name, optional, paramsClassPrototype, variadicType } = options;

  const type = variadicType || Reflect.getMetadata('design:type', paramsClassPrototype, name);

  const variadic = !!variadicType;
  const values = getCommandValues(paramsClassPrototype);

  if (variadic && values.some((value) => value.variadic)) {
    throw new Error('Command can have only one variadic value');
  }

  values.push({
    name,
    type,
    optional,
    variadic
  });

  Reflect.defineMetadata(metadataKeys.values, values, options.paramsClassPrototype);
}

export function getCommandOptions(paramsClassPrototype: any): CommandOptionDefinition[] {
  return [...(Reflect.getOwnMetadata(metadataKeys.options, paramsClassPrototype) || [])];
}

export function addCommandOption(paramsClassPrototype: any, name: string, options: CommandOptionDefinitionOptions | undefined) {
  const type = Reflect.getMetadata('design:type', paramsClassPrototype, name);

  const allOptions = getCommandOptions(paramsClassPrototype);
  allOptions.push({
    name,
    type,
    ...options
  });
  Reflect.defineMetadata(metadataKeys.options, allOptions, paramsClassPrototype);
}
