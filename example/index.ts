import * as path from 'path';
import * as cli from '../src';

async function run() {
  const commandsPath = path.join(__dirname, 'commands');
  await cli.commandsFromDirectory(commandsPath);
  await cli.execute();
}

// tslint:disable-next-line:no-console
run().catch((err) => console.error(err));
