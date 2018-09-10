// tslint:disable:no-console
import * as root from 'app-root-path';
import chalk from 'chalk';
import * as cli from 'commander';
import * as fs from 'fs-extra';
import { getCommandOptions, getCommands, getCommandValues } from './metadata';
import { Command, CommandDefinition, CommandOptionDefinition, CommandValueDefinition, IocContainer } from './types';

export class Commander {
  private iocContainer?: IocContainer;
  private _version?: string;
  private isCommanderInitialised = false;

  public ioc(iocContainer: IocContainer): this {
    this.iocContainer = iocContainer;
    return this;
  }

  public version(version: string): this {
    this._version = version;
    return this;
  }

  public async execute(argv?: string[]): Promise<void> {
    await this.initialiseCommander();

    const args = argv || process.argv;

    if (args.length <= 2) {
      cli.help();
    }

    cli.parse(args);
  }

  private async initialiseCommander() {
    if (this.isCommanderInitialised) {
      return;
    }
    await this.setVersion();
    this.registerCommands();
    this.isCommanderInitialised = true;
  }

  private async getPackageVersion(): Promise<string | undefined> {
    const packageFileName = root.resolve('package.json');
    if (!await fs.pathExists(packageFileName)) {
      return undefined;
    }

    const packageObject = await fs.readJSON(packageFileName);

    return packageObject && packageObject.version;
  }

  private async setVersion() {
    const version =
      this._version !== undefined ?
        this._version :
        await this.getPackageVersion();

    if (version) {
      cli.version(version);
    }
  }

  private getValuesUsage(values: CommandValueDefinition[]) {
    return values
      .map((param) => param.optional ? `[${param.name}]` : `<${param.name}>`)
      .join(' ');
  }

  private getOptionUsage(option: CommandOptionDefinition): string {
    let result = '';

    if (option.shortName) {
      result = `-${option.shortName}`;
    }

    result += ` --${option.name.toString()}`;

    if (option.valueName) {
      result += ` <${option.valueName}>`;
    }

    return result.trim();
  }

  private registerCommandOption(cliCommand: cli.Command, paramsClass: { new(...args: any[]): any }, option: CommandOptionDefinition) {
    const optionUsage = this.getOptionUsage(option);
    const coerceValue = !option.valueName ? undefined : ((value: string) => {
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
      coerceValue,
      defaultValue
    );
  }

  private getParams(
    command: CommandDefinition<any>,
    args: any[]
  ) {
    const values = getCommandValues(command.paramsClass.prototype);
    const options = getCommandOptions(command.paramsClass.prototype);

    const params: { [paramName: string]: any } = new command.paramsClass();
    let paramIndex = 0;

    for (const value of values) {
      params[value.name] = args[paramIndex++];
    }

    const optionValues = args[paramIndex];
    for (const option of options) {
      params[option.name.toString()] = optionValues[option.name];
      if (option.shortName) {
        params[option.shortName] = optionValues[option.shortName];
      }
    }

    return params;
  }

  private instantiateCommand(command: CommandDefinition<any>) {
    const constructor = command.type as { new(...args: any[]): Command<any> };
    const instance = this.iocContainer ? this.iocContainer.get(constructor) : new constructor();
    return instance;
  }

  private registerCommand(command: CommandDefinition<any>) {
    const values = getCommandValues(command.paramsClass.prototype);
    const usage = `${command.name} ${this.getValuesUsage(values)}`;
    const cliCommand = cli.command(usage);

    if (command.description) {
      cliCommand.description(command.description);
    }

    const options = getCommandOptions(command.paramsClass.prototype);
    for (const option of options) {
      this.registerCommandOption(cliCommand, command.paramsClass, option);
    }

    cliCommand.action(async (...args: any[]) => {
      try {
        const commandInstance = this.instantiateCommand(command);
        const params = this.getParams(command, args);
        await commandInstance.execute(params);
      } catch (err) {
        console.error();
        console.error(chalk.red(err.stack || err.message || err));
        console.error();
        process.exit(1);
      }
    });
  }

  private registerCommands() {
    const commands = getCommands();

    for (const command of commands) {
      this.registerCommand(command);
    }
  }
}
