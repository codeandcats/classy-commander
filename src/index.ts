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

export async function execute(argv?: string[]): Promise<void> {
  return commander.execute(argv);
}

export function getCommandUsageString(commandClass: CommandClass<any>) {
  return getCommandUsage(commandClass);
}
