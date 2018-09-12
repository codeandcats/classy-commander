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

export function addCommandValue(paramsClassPrototype: any, options: Pick<CommandValueDefinition, 'name' | 'optional'>) {
  const type = Reflect.getMetadata('design:type', paramsClassPrototype, options.name);
  const values = getCommandValues(paramsClassPrototype);
  values.push({ ...options, type });
  Reflect.defineMetadata(metadataKeys.values, values, paramsClassPrototype);
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
