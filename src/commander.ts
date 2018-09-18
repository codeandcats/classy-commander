import chalk from 'chalk';
import * as cli from 'commander';
import * as _ from 'lodash';
import { coerceValue } from './coercion';
import { errorToString } from './errors';
import { getCommandOptions, getCommandValues } from './metadata';
import { Command, CommandClass, CommandDefinition, CommandOptionDefinition, CommandValueDefinition, IocContainer } from './types';

let iocContainer: IocContainer | undefined;

const commandDefinitions: Array<CommandDefinition<any>> = [];

export function setIocContainer(container: IocContainer | undefined) {
  iocContainer = container;
}

export function getIocContainer(): IocContainer | undefined {
  return iocContainer;
}

function getOptionUsage(option: CommandOptionDefinition): string {
  let result = '';

  if (option.shortName) {
    result = `-${option.shortName}, `;
  }

  result += `--${option.name.toString()} `;

  if (option.valueName) {
    result += `<${option.valueName}>`;
  }

  return result.trim();
}

function getParams(
  command: CommandDefinition<any>,
  args: any[]
) {
  const values = getCommandValues(command.paramsClass.prototype);
  const options = getCommandOptions(command.paramsClass.prototype);

  const params: {
    [key: string]: string | number | boolean | undefined | string[] | number[] | boolean[]
  } = new command.paramsClass();

  let paramIndex = 0;

  for (const value of values) {
    const argValue = args[paramIndex++];
    const defaultValue = params[value.name];

    const paramValue = coerceValue(
      argValue,
      value.type as any,
      defaultValue
    );

    params[value.name] = paramValue;
  }

  const optionValues = args[paramIndex];

  for (const option of options) {
    params[option.name.toString()] = optionValues[option.name];
  }

  return params;
}

function instantiateCommand(command: CommandDefinition<any>) {
  const constructor = command.type as { new(...args: any[]): Command<any> };
  const instance = iocContainer ? iocContainer.get(constructor) : new constructor();
  return instance;
}

function registerCommandOption(
  cliCommand: cli.Command,
  paramsClass: { new(...args: any[]): any; },
  option: CommandOptionDefinition
) {
  const optionUsage = getOptionUsage(option);
  const coercedValue = !option.valueName ? undefined : ((value: string) => {
    if (option.valueName && option.type === Number) {
      return +value;
    } else {
      return value;
    }
  });

  const params = new paramsClass();
  const defaultValue = params[option.name];

  cliCommand.option(
    optionUsage,
    option.description,
    coercedValue,
    defaultValue
  );
}

export function registerCommand(commandDefinition: CommandDefinition<any>) {
  commandDefinitions.push(commandDefinition);

  const usage = getCommandDefinitionUsage(commandDefinition);
  const cliCommand = cli.command(usage);

  if (commandDefinition.description) {
    cliCommand.description(commandDefinition.description);
  }

  const options = getCommandOptions(commandDefinition.paramsClass.prototype);
  for (const option of options) {
    registerCommandOption(cliCommand, commandDefinition.paramsClass, option);
  }

  cliCommand.action(async (...args: any[]) => {
    try {
      const commandInstance = instantiateCommand(commandDefinition);
      const params = getParams(commandDefinition, args);
      await commandInstance.execute(params);
    } catch (err) {
      // tslint:disable:no-console
      console.error();
      console.error(chalk.red(errorToString(err)));
      console.error();
      process.exit(1);
      // tslint:enable:no-console
    }
  });
}

function valueDefinitionToUsageString(value: CommandValueDefinition) {
  const name = `${value.name}${value.variadic ? '...' : ''}`;
  const usage = value.optional ? `[${name}]` : `<${name}>`;
  return usage;
}

export function getCommandDefinitionUsage(commandDefinition: CommandDefinition<any>) {
  const values = getCommandValues(commandDefinition.paramsClass.prototype);
  const valuesUsage = _
    .chain(values)
    .map((value, index) => ({
      value,
      index
    }))
    .sort((a, b) => a.value.variadic ? 1 : b.value.variadic ? -1 : a.index - b.index)
    .map((valueAndIndex) => valueDefinitionToUsageString(valueAndIndex.value))
    .join(' ')
    .value();
  const usage = `${commandDefinition.name} ${valuesUsage}`.trim();
  return usage;
}

export function getCommandUsage(commandClass: CommandClass<any>) {
  const commandDefinition = commandDefinitions
    .find((item) => item.type === commandClass);

  if (!commandDefinition) {
    throw new Error('Class is not a command');
  }

  const usage = getCommandDefinitionUsage(commandDefinition);

  return usage;
}
