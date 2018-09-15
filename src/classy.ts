// tslint:disable:no-console
import * as cli from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
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

  public versionFromPackage(dirName: string): this {
    this._version = this.getPackageVersion(path.resolve(dirName, './package.json'));
    return this;
  }

  public async execute(argv?: string[]): Promise<void> {
    if (this._version) {
      cli.version(this._version);
    }

    const args = argv || process.argv;

    if (args.length <= 2) {
      cli.help();
    }

    cli.parse(args);
  }

  private getPackageVersion(packageFileName: string): string | undefined {
    const exists = fs.pathExistsSync(packageFileName);
    if (!exists) {
      throw new Error('Could not find package.json to load version from');
    }
    const packageObject = fs.readJSONSync(packageFileName);
    const version = packageObject && packageObject.version;
    return version;
  }
}
