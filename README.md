# classy-commander
A TypeScript wrapper for [Commander](https://github.com/tj/commander.js/) that lets you easily declare commands using classes & decorators and provides strongly typed arguments.



## Features
- Write commands as modular classes that can be easily tested
- Specify command usage via a class with decorators
- Command values
- Optional values
- Options
- Options with values
- Automatic coercion
- Version from package.json
- Support for Inversion of Control containers like [Inversify](http://inversify.io/)



## Install
```sh
npm install classy-commander --save
```


## Usage
First let's enable support for decorators in your tsconfig.json (if you're using TypeScript).
`tsconfig.json`
```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

Here is a simple example that lets you log into the Department of Defense.


`./index.ts`
```typescript
import * as commander from 'classy-commander';

async function run() {
  const commandsPath = path.join(__dirname, 'commands');
  await cli.commandsFromDirectory(commandsPath);

  cli.execute();
}

run().catch(console.error);
```

`./commands/login.ts`
```typescript
import { Command, command, value } from 'classy-commander';

export class LoginParams {
  @value()
  username: string = '';

  @value()
  password: string = '';
}

@command('login', LoginParams)
export class Login implements Command<LoginParams> {

  async execute(params: LoginParams) {
    const { username, password } = params;

    if (password === 'Password123') {
      console.log(`Authenticated. Welcome ${username}.`);

      return;
    }

    console.error('Password incorrect');
  }

}
```

Running `ts-node ./index.ts --help` outputs:

```
  Usage: index.ts [options] [command]

  Options:

    -V, --version                          output the version number
    -h, --help                             output usage information

  Commands:

    login [options] <username> <password>
```

Running `ts-node ./index.ts login John Password123` outputs:

```
Authenticated. Welcome John.
```


## Using optional values

Now lets allow users to log in as "guest" with no password.

```typescript
import { Command, command, value } from 'classy-commander';

export class LoginParams {
  @value()
  username: string = '';

  @value({ optional: true })
  password?: string;
}

@command('login', LoginParams)
export class Login implements Command<LoginParams> {

  async execute(params: LoginParams) {
    const { username, password } = params;

    if (password === 'Password123' || (username === 'guest' && !password)) {
      console.log(`Authenticated. Welcome ${username}.`);

      return;
    }

    console.error('Password incorrect');
  }

}
```

Running `ts-node ./index.ts --help` now outputs:

```
  Usage: index.ts [options] [command]

  Options:

    -V, --version                          output the version number
    -h, --help                             output usage information

  Commands:

    login [options] <username> [password]
```



## Using options

Now let's change the login command to optionally keep the user's session alive.

```typescript
import { Command, command, option, value } from 'classy-commander';

export class LoginParams {
  @value()
  username: string = '';

  @value()
  password: string = '';

  @option({ description: 'Keeps user logged in' })
  rememberMe: boolean = false;
}

@command('login', LoginParams)
export class LoginCommand implements Command<LoginParams> {

  async execute(params: LoginParams) {
    const { username, password, rememberMe } = params;

    if (password === 'Password123' || (username === 'guest' && !password)) {
      console.log(`Authenticated. Welcome ${username}`);

      if (rememberMe) {
        console.log(`Session will be kept alive until you log out`);
      }

      return;
    }

    console.error('Password incorrect');
  }

}
```

Running `ts-node index.ts login John Password123 --rememberMe` outputs:

```
Authenticated. Welcome John
Session will be kept alive until you log out.
```



## Using option values

Let's update our login command to allow specifying the number of days to keep the user logged in for.

```typescript
import { Command, command, option, value } from 'classy-commander';

export class LoginParams {
  @value()
  username: string = '';

  @value()
  password: string = '';

  @option({ valueName: 'days', description: 'Number of days to keep user logged in for' })
  rememberMeFor: number = 3;
}

@command('login', LoginParams)
export class LoginCommand implements Command<LoginParams> {
  async execute(params: LoginParams) {
    const { username, password, rememberMeFor } = params;

    if (password === 'Password123' || (username === 'guest' && !password)) {
      console.log(`Authenticated. Welcome ${username}`);

      if (rememberMeFor) {
        console.log(`Session will be kept alive for ${rememberMeFor} days`);
      }

      return;
    }

    console.error('Password incorrect');
  }
}
```

Running `ts-node index.ts login --help` outputs:

```
  Usage: login [options] <username> <password>

  Options:

    --rememberMeFor <days>  Number of days to keep user logged in for (default: 3)
    -h, --help              output usage information
```

Running `ts-node index.ts login John Password123 --rememberMeFor 7` outputs:

```
Authenticated. Welcome John
Session will be kept alive for 7 days
```



## Dependency Injection
To keep our command simple and easy to test, we can move some of its code into other services, and have those services automatically injected into the command when it is created. Let's use the awesome [Inversify](http://inversify.io/) library (though in principal we could use any JavaScript Inversion of Control library).

`./services/auth.ts`
```typescript
import { injectable } from 'inversify';

@injectable()
export class AuthService {
  login(username: string, password: string, keepAliveDurationDays: number) {
    if (password === 'Password123' || (username === 'guest' && !password)) {
      return true;
    }

    return false;
  }
}
```

`./services/logger.ts`
```typescript
@injectable()
export class Logger {
  log(...args: any[]) {
    console.log(...args);
  }

  error(...args: any[]) {
    console.error(...args);
  }
}
```

`./commands/login.ts`
```typescript
import { Command, command, option, value } from 'classy-commander';
import { AuthService } from '../services/auth.ts';
import { Logger } from '../services/logger.ts';

export class LoginParams {
  @value()
  username: string = '';

  @value()
  password: string = '';

  @option({ valueName: 'days', description: 'Number of days to keep user logged in for' })
  rememberMeFor: number = 3;
}

@injectable()
@command('login', LoginParams)
export class LoginCommand implements Command<LoginParams> {
  constructor(private auth: AuthService, private logger: Logger) {
  }

  async execute(params: LoginParams) {
    const { username, password, rememberMeFor } = params;

    if (this.auth.login(username, password, rememberMeFor)) {
      this.logger.log(`Authenticated. Welcome ${username}`);

      if (rememberMeFor) {
        this.logger.log(`Session will be kept alive for ${rememberMeFor} days`);
      }

      return;
    }

    this.logger.error('Password incorrect');
  }
}
```



## Specifying the version
There are two ways to specify the version of your CLI:

Using the version in your `package.json`

```typescript
import * as commander from 'classy-commander';

...

commander
  .versionFromPackage(__dirname)
  .execute();
```

Or manually

```typescript
import * as commander from 'classy-commander';

...

commander
  .version('1.3.1')
  .execute();
```


