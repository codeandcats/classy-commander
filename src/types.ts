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

export interface CommandDefinition<TParams> {
  name: string;
  description: string | undefined;
  type: CommandClass<TParams>;
  paramsClass: CommandParamsClass<TParams>;
}

export interface Command<TParams> {
  execute(params: TParams): Promise<void>;
}

export interface CommandParamsClass<T> {
  new(): T;
}

export interface CommandClass<TParams> {
  new(...args: any[]): Command<TParams>;
}

export interface IocContainer {
  get: <T>(Class: { new(...args: any[]): T }) => T;
}
