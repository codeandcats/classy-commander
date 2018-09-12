// tslint:disable:no-console
import * as root from 'app-root-path';
import * as cli from 'commander';
import * as fs from 'fs-extra';
import { setIocContainer } from './commander';
import { IocContainer } from './types';

export class Commander {
  private _version?: string;

  public ioc(iocContainer: IocContainer): this {
    setIocContainer(iocContainer);
    return this;
  }

  public version(version: string): this {
    this._version = version;
    return this;
  }

  public async execute(argv?: string[]): Promise<void> {
    await this.setVersion();

    const args = argv || process.argv;

    if (args.length <= 2) {
      cli.help();
    }

    cli.parse(args);
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
}
