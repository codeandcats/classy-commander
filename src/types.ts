export interface CommandValueDefinition {
  name: string;
  type: typeof String | typeof Number | typeof Boolean;
  optional: boolean;
}

export interface CommandOptionDefinition {
  name: string;
  shortName?: string;
  description?: string;
  type: typeof String | typeof Number;
  valueName?: string;
}

export interface CommandOptionDefinitionOptions {
  shortName?: string;
  description?: string;
  valueName?: string;
}

export interface CommandDefinition<TCommand> {
  name: string;
  type: { new(...args: any[]): TCommand };
  paramsClass: { new(): any };
  description?: string;
}

export interface Command<TParams> {
  execute(params: TParams): Promise<void>;
}

export interface IocContainer {
  get: <T>(Class: { new(...args: any[]): T }) => T;
}
