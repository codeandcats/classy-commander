import { Container } from 'inversify';
import * as path from 'path';
import * as cli from '../src';

import './services/calculator';

const container = new Container({ autoBindInjectable: true });

async function run() {
  await cli
    .versionFromPackage(__dirname)
    .ioc(container)
    .commandsFromDirectory(path.join(__dirname, '/commands'));

  cli.execute();
}

// tslint:disable-next-line:no-console
run().catch(console.error);
