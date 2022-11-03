# UniLogr: a Universal Logger

[![Version npm](https://img.shields.io/npm/v/unilogr.svg?logo=npm)](https://www.npmjs.com/package/unilogr)

UniLogr is a logger for both Node.js and Browser based on Winston.

## Motivation

This project aims to provide a simple but powerful logger that works on both Node.js and the Browser.
The logger should be flexible and convenient, allowing the user to add custom outputs and create sub-loggers.

## Installation

Install with NPM:

```bash
npm install unilogr
```

Install with Yarn:

```bash
yarn add unilogr
```

Install with PNPM:

```bash
pnpm add unilogr
```

## Usage

A logger is constructed from a sequence of operations that will be executed on each log.
The operation `writeTo` is used to write a log to an output stream.

### Creating a logger

```js
import {
  addInterval,
  addTimestamp,
  capitalizeField,
  colorizeField,
  ConsoleOutput,
  Logger,
  markExtensionSlot,
  writeTo,
} from 'unilogr';

const logger = new Logger([
  capitalizeField('level'), // Capitalize the "level" field
  colorizeField('level'), // Colorize the "level" field according to severity
  addTimestamp(), // Add the "timestamp" field
  addInterval(), // Add the "interval" field

  markExtensionSlot(), // Mark this spot for extensions

  ({ timestamp, level, message, interval }) =>
    `${timestamp} [${level}]: ${message} (${interval})`, // Format message

  writeTo(new ConsoleOutput()), // Write formatted message to console
]);

logger.info('Test'); // 2022-11-01 19:11:47 [INFO]: Test (+0ms)
```

### Log levels

UniLogr uses the following log levels:

```js
logger.error('Error');
logger.warn('Warn');
logger.info('Info');
logger.debug('Debug');
logger.verbose('Verbose');
```

### The Info object

The `info` object is a plain JavaScript object that contains at least the following fields:

```js
const info = {
  level: 'info', // Customizable field (colorize it, capitalize it, etc.)
  message: 'Example', // Customizable field

  [LEVEL_SYMBOL]: 'info', // Read-only field used to determine original log level
  [OUTPUT_SYMBOL]: '[INFO]: Example', // String that will be written to the output
  [ARGS_SYMBOL]: [], // Arguments for messages containing %s, %d, %o, etc.
};
```

### String interpolation

UniLogr supports string interpolation using `%s`, `%d`, `%o`, etc. as placeholders.
Arguments without corresponding placeholders are merged into the `info` object.

```js
const logger = new Logger([
  (info) => {
    info[OUTPUT_SYMBOL] = `[${info.level}] (${info.ctx}): ${info.message}`;
  },

  writeTo(new ConsoleOutput()),
]);

logger.info('Origin is %s', 'http://localhost', { ctx: 'CORS' });
// Output: [info] (CORS): Origin is http://localhost
```

### Filtering logs

You can discard logs by returning `false` in an operation:

```js
const logger = new Logger([
  (info) => info.ctx === 'Auth', // Accept only logs with 'Auth' context

  // ...
]);

logger.info('Server started.', { ctx: 'Startup' }); // Discarded

logger.info('Refreshing tokens...', { ctx: 'Auth' }); // Accepted
```

UniLogr provides the utility function `discardLessSevereThan()` to easily filter logs by level of severity:

```js
const logger = new Logger([
  discardLessSevereThan('warn'), // Discard logs with level less severe than 'warn'
  // Same as: (info) => levels[info[LEVEL_SYMBOL]] <= levels['warn']

  // ...
]);
```

### Extending a logger

A logger can be extended by inserting more operations.
Operations are inserted in slots marked by `markExtensionSlot()`.

```js
const mainLogger = new Logger([
  addContext('Main context'),

  markExtensionSlot(), // <<< Extension operations are inserted here

  ({ timestamp, message, ctx }) =>
    `${timestamp}${ctx ? ` (${ctx})` : ''}: ${message}`,
]);

mainLogger.info('Main logger test');
// Output: 2029-05-02 11:18:41 (Main context): Main logger test

const subLogger = mainLogger.extend([addContext('Sub context')]);

subLogger.info('Sub logger test');
// Output: 2029-05-02 11:18:41 (Main context > Sub context): Sub logger test
```

The utility function `logger.sub(context)` helps to easily create sub-loggers:

```js
const subLogger = mainLogger.sub('Sub context');
// Appends the context to the field "ctx" in the info object.
// Same as mainLogger.extend([addContext('Sub context')])
```

You can create and extend multiple slots by giving them different names.

```js
const mainLogger = new Logger([
  // ...
  markExtensionSlot(), // name: 'defaultSlot'
  // ...
  markExtensionSlot('slot1'),

  ({ timestamp, level, message, ctx }) =>
    `${timestamp} [${level}]${ctx ? ` (${ctx})` : ''}: ${message}`,

  markExtensionSlot('slot2'),
]);

const subLogger = mainLogger.extend({
  defaultSlot: [addContext('server.ts')],

  slot1: [addTimestamp()],

  slot2: [writeTo(new FileOutput('logs.txt'))],
});
```

## License

MIT
