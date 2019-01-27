<p align="center">
  <img src="https://raw.githubusercontent.com/codeandcats/classy-commander/master/img/logo.png" />
  <p align="center">
    A TypeScript wrapper for <a href="https://github.com/tj/commander.js/">Commander</a> that lets you easily declare commands using classes & decorators and provides you with strongly typed arguments.
  <p>
</p>

[![npm version](https://badge.fury.io/js/classy-commander.svg)](https://badge.fury.io/js/classy-commander)
[![Build Status](https://travis-ci.org/codeandcats/classy-commander.svg?branch=master)](https://travis-ci.org/codeandcats/classy-commander)
[![Coverage Status](https://coveralls.io/repos/github/codeandcats/classy-commander/badge.svg?branch=master)](https://coveralls.io/github/codeandcats/classy-commander?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/codeandcats/classy-commander.svg)](https://greenkeeper.io/)


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
First enable support for decorators in your `tsconfig.json` compiler options.

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
  }
}
```

Let's create a simple Calculator CLI app with a command that adds two numbers.

Our entry-point looks like this.

`./calc.ts`
```typescript
import * as cli from 'classy-commander';

import './commands/add.ts';

cli.execute();
```

Our add command looks like this.

`./commands/add.ts`
```typescript
import { Command, command, value } from 'classy-commander';

export class AddCommandParams {
  @value()
  value1: number = 0;

  @value()
  value2: number = 0;
}

@command('add', AddCommandParams, 'Adds two numbers')
export class AddCommand implements Command<AddCommandParams> {

  execute(params: AddCommandParams) {
    const { value1, value2 } = params;

    const result = value1 + value2;

    console.log(`${value1} + ${value2} = ${result}`);
  }

}
```

For simplicity, we'll use [ts-node](https://github.com/TypeStrong/ts-node) to run our app.

Running `ts-node ./calc add 1 2` outputs:

```
1 + 2 = 3
```



## Using optional values

But what if we want to add 3 numbers?

Lets allow adding an _optional_ third number.

```typescript
import { Command, command, value } from 'classy-commander';

export class AddCommandParams {
  @value()
  value1: number = 0;

  @value()
  value2: number = 0;

  @value({ optional: true })
  value3: number = 0;
}

@command('add', AddCommandParams, 'Adds two or three numbers')
export class AddCommand implements Command<AddCommandParams> {

  execute(params: AddCommandParams) {
    const { value1, value2, value3 } = params;

    const result = value1 + value2 + value3;

    if (value3) {
      console.log(`${value1} + ${value2} + ${value3} = ${result}`);
    } else {
      console.log(`${value1} + ${value2} = ${result}`);
    }
  }

}
```

Running `ts-node ./calc add 1 2 3` now outputs:

```
1 + 2 + 3 = 6
```

Adding two numbers still works. `ts-node ./calc add 1 2` outputs:
```
1 + 2 = 6
```



## Variadic Arguments

Okay, but what if we want to add 4 numbers, or 5? This could get messy.

It's time to turn our values into a variadic value.

```typescript
import { Command, command, value } from 'classy-commander';

export class AddCommandParams {
  @value({ variadic: { type: Number } })
  values: number[] = [];
}

@command('add', AddCommandParams, 'Adds two or more numbers')
export class AddCommand implements Command<AddCommandParams> {

  execute(params: AddCommandParams) {
    const { values } = params;

    const result = values.reduce((total, val) => total + val, 0);

    console.log(`${values.join(' + ')} = ${result}`);
  }

}
```

Running `ts-node ./calc add 1 2 3 4 5` now outputs:

```
1 + 2 + 3 + 4 + 5 = 15
```



## Using options

Let's add an option to show thousand separators.

```typescript
import { Command, command, option, value } from 'classy-commander';

export class AddCommandParams {
  @value({ variadic: { type: Number } })
  values: number[] = [];

  @option({ shortName: 't' })
  thousandSeparators: boolean = false;
}

@command('add', AddCommandParams, 'Adds two or more numbers')
export class AddCommand implements Command<AddCommandParams> {

  execute(params: AddCommandParams) {
    const { values, thousandSeparators } = params;

    const result = values.reduce((total, val) => total + val, 0);

    const format = (val: number) => val.toLocaleString(undefined, {
      useGrouping: thousandSeparators
    });

    console.log(`${values.map((val) => format(val)).join(' + ')} = ${format(result)}`);
  }

}
```

Running `ts-node ./calc add 500 1000 --thousandSeparators` or `ts-node ./calc add 500 1000 -t` will output:

```
500 + 1,000 = 1,500
```



## Using option values

Lets add an option with a value that lets us specify the number of decimal places to show.

```typescript
import { Command, command, option, value } from 'classy-commander';

export class AddCommandParams {
  @value({ variadic: { type: Number } })
  values: number[] = [];

  @option({ shortName: 't' })
  thousandSeparators: boolean = false;

  @option({ shortName: 'd', valueName: 'count' })
  decimalPlaces: number = 0;
}

@command('add', AddCommandParams, 'Adds two or more numbers')
export class AddCommand implements Command<AddCommandParams> {

  execute(params: AddCommandParams) {
    const { values, thousandSeparators, decimalPlaces } = params;

    const result = values.reduce((total, val) => total + val, 0);

    const format = (val: number) => val.toLocaleString(undefined, {
      useGrouping: thousandSeparators,
      maximumFractionDigits: decimalPlaces
    });

    console.log(`${values.map((val) => format(val)).join(' + ')} = ${format(result)}`);
  }

}
```

Running `ts-node ./calc add 1 2.2345 --decimalPlaces 2` will output:

```
1 + 2.23 = 3.23
```



## Getting usage

Running `ts-node ./calc.ts --help` outputs:

```
  Usage: calc [options] [command]

Options:

  -h, --help                 output usage information

Commands:

  add [options] <values...>
```

Running `ts-node ./calc.ts add --help` shows the usage for our `add` command:

```
Usage: add [options] <values...>

Options:

  -t, --thousandSeparators
  -d, --decimalPlaces <count>   (default: 0)
  -h, --help                   output usage information
```



## Dependency Injection
To keep our add command easy to test, lets move that heavy math into a calculator service, and have that service automatically injected into the command when it gets created. Let's use the awesome [Inversify](http://inversify.io/) library which has excellent support for TypeScript (though in principal we could use any JavaScript Dependency Injection library).

Let's start by adding the calculator service.

`./services/calculator.ts`
```typescript
import { injectable } from 'inversify';

@injectable()
export class Calculator {
  add(...amounts: number[]) {
    return amounts.reduce((total, amount) => total + amount, 0);
  }
}
```

Now lets update our add command to use the service.

`./commands/add.ts`
```typescript
import { injectable } from 'inversify';
import { Command, command, option, value } from 'classy-commander';
import { Calculator } from '../services/calculator';

export class AddCommandParams {
  @value({ variadic: { type: Number } })
  values: number[] = [];

  @option({ shortName: 't' })
  thousandSeparators: boolean = false;

  @option({ shortName: 'd', valueName: 'count' })
  decimalPlaces: number = 0;
}

@command('add', AddCommandParams, 'Adds two or more numbers')
@injectable()
export class AddCommand implements Command<AddCommandParams> {
  constructor(private calculator: Calculator) {
  }

  execute(params: AddCommandParams) {
    const { values, thousandSeparators, decimalPlaces } = params;

    const result = this.calculator.add(...values);

    const format = (val: number) => val.toLocaleString(undefined, {
      useGrouping: thousandSeparators,
      maximumFractionDigits: decimalPlaces
    });

    console.log(`${values.map((val) => format(val)).join(' + ')} = ${format(result)}`);
  }

}
```

Finally, in our entrypoint, lets create our inversify container and pass it to classy-commander.

`./calc.ts`
```typescript
import { Container } from 'inversify';
import * as cli from 'classy-commander';

import './commands/add.ts';
import './services/calculator';

const container = new Container({ autoBindInjectable: true });

cli
  .ioc(container)
  .execute();
```



## Specifying the version
There are two ways to specify the version of your CLI:

Using the version in your `package.json`.

```typescript
import * as cli from 'classy-commander';

...

cli
  .versionFromPackage(__dirname)
  .execute();
```

Or manually.

```typescript
import * as cli from 'classy-commander';

...

cli
  .version('1.2.3')
  .execute();
```

## Loading commands from a directory
Maybe we end up adding a bunch of commands to our CLI app and we don't want to manually import each command in our entry point like below:

```typescript
import * as cli from 'classy-commander';

import './commands/add.ts';
import './commands/subtract.ts';
import './commands/multiply.ts';
import './commands/divide.ts';
import './commands/square.ts';
import './commands/squareRoot.ts';
import './commands/cube.ts';
import './commands/cubeRoot.ts';

cli.execute();
```

We can tell classy-commander to dynamically load all commands from a directory thus reducing our imports.

```typescript
import * as cli from 'classy-commander';
import * as path from 'path';

async function run() {
  await cli.commandsFromDirectory(path.join(__dirname, '/commands'));
  cli.execute();
}

run().catch(console.error);
```

## Contributing
Got an issue or a feature request? [Log it](https://github.com/codeandcats/classy-commander/issues).

[Pull-requests](https://github.com/codeandcats/classy-commander/pulls) are also welcome. 😸
