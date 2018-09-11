# classy-commander
A TypeScript wrapper for [Commander](https://github.com/tj/commander.js/) that lets you easily declare commands using classes & decorators and provides strongly typed arguments.


## Features
- Write commands as modular classes that can be easily tested
- Specify command usage via a class with decorators
- Command values
- Optional values
- Options
- Options with values
- Coercion
- Version from package.json
- Support for Inversion of Control containers like [Inversify](http://inversify.io/)


## Install
```sh
npm install classy-commander --save
```


## Usage
Here is a simple example that lets you log into the Department of Defense.

`index.ts`
```typescript
import * as commander from 'classy-commander';

import './commands/login';

commander.execute();
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
    if (params.password !== 'Password123') {
      return console.error('Password incorrect');
    }

    console.log(`Authenticated. Welcome ${params.username}.`);
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

## Using options

Lets update our awesome login command to optionally keep the user's session alive.

`./commands/login.ts`
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
    if (params.password !== 'Password123') {
      return console.error('Password incorrect');
    }

    console.log(`Authenticated. Welcome ${params.username}`);

    if (params.rememberMe) {
      console.log(`Session will be kept alive until you log out`);
    }
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
    if (params.password !== 'Password123') {
      return console.error('Password incorrect');
    }

    console.log(`Authenticated. Welcome ${params.username}`);

    if (params.rememberMeFor) {
      console.log(`Session will be kept alive for ${params.rememberMeFor} days`);
    }
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


## Specifying the version
By default classy-commander will report the version stored in your the `package.json`, or you can optionally specify your own.

```typescript
import * as commander from 'classy-commander';

...

commander
  .version('1.0.1')
  .execute();
```
