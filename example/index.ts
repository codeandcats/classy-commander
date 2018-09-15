// tslint:disable:no-console
import * as cli from '../src';

import './commands/greet';
import './commands/login';

cli.execute().catch((err) => console.error(err));
