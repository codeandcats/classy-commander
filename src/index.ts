import { Commander } from './classy';
import { getCommandUsage } from './commander';
import { CommandClass, IocContainer } from './types';

export { command, option, value } from './decorators';
export { Command, CommandValueDefinition, CommandOptionDefinition, CommandOptionDefinitionOptions, IocContainer } from './types';

const commander = new Commander();

// tslint:disable-next-line:no-shadowed-variable
export function version(version: string): Commander {
  return commander.version(version);
}

export function versionFromPackage(dirName: string): Commander {
  return commander.versionFromPackage(dirName);
}

export function ioc(container: IocContainer): Commander {
  return commander.ioc(container);
}

/**
 * Loads all commands within a directory so you don't need to require them individually.
 * @param directoryPath Directory path of the commands.
 */
export async function commandsFromDirectory(directoryPath: string): Promise<Commander> {
  return commander.commandsFromDirectory(directoryPath);
}

export async function execute(argv?: string[]): Promise<void> {
  return commander.execute(argv);
}

export function getCommandUsageString(commandClass: CommandClass<any>) {
  return getCommandUsage(commandClass);
}
