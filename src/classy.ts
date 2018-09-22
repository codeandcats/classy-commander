// tslint:disable:no-console
import * as cli from 'commander';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as _ from 'lodash';
import * as path from 'path';
import { setIocContainer } from './commander';
import { getUniqueModuleNames } from './modules';
import { IocContainer } from './types';

export class Commander {
  private _version?: string;

  public ioc(iocContainer: IocContainer): this {
    setIocContainer(iocContainer);
    return this;
  }

  public async commandsFromDirectory(directoryPath: string): Promise<this> {
    return new Promise<this>((resolve, reject) => {
      const pattern = path.join(directoryPath, '**/*.@(js|ts)');

      glob(pattern, (err, matches) => {
        if (err) {
          return reject(err);
        }

        const moduleFileNames = getUniqueModuleNames(matches);

        for (const moduleFileName of moduleFileNames) {
          require(moduleFileName);
        }

        resolve(this);
      });
    });
  }

  public version(version: string) {
    this._version = version;
    return this;
  }

  public versionFromPackage(directoryPath: string) {
    this._version = this.getPackageVersion(path.resolve(directoryPath, './package.json'));
    return this;
  }

  public execute(argv?: string[]) {
    if (this._version) {
      cli.version(this._version);
    }

    const args = argv || process.argv;

    if (args.length <= 2) {
      cli.help((text) => `${text}\n`);
    }

    cli.on('command:*', () => {
      console.error();
      console.error(
        'Invalid command: %s\nSee --help for a list of available commands.',
        cli.args.join(' ')
      );
      console.error();
      process.exit(1);
    });

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
