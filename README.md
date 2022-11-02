# UniLogr: a Universal Logger

[![Version npm](https://img.shields.io/npm/v/unilogr.svg?logo=npm)](https://www.npmjs.com/package/unilogr)

UniLogr is a logger for both Node.js and Browser based on Winston.
It's simple, but very powerful.

## Motivation

## Usage

A logger is constructed from a sequence of operations.
`writeTo` is used to write a log to an output stream.

### Creating a logger

```js
import { Logger } from 'unilogr';
import {
  addInterval,
  addTimestamp,
  capitalizeField,
  colorizeField,
  markExtensionSlot,
  writeTo,
} from 'unilogr/operations';
import { ConsoleOutput } from 'unilogr/outputs';

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

logger.info('Origin is %s', 'http://localhost', { ctx: 'CORS' }); // [info] (CORS): Origin is http://localhost
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

Logs can be filtered by level by using the `discardLessSevereThan()` operation:

```js
const logger = new Logger([
  discardLessSevereThan('warn'), // Discard logs with level less severe than 'warn'
  // Same as: (info) => levels[info[LEVEL_SYMBOL]] <= levels['warn']

  // ...
]);
```

### Extending a logger

A logger can be extended with more operations.
Operations can be inserted in slots marked by `markExtensionSlot()`.

```js
const mainLogger = new Logger([
  addContext('Main context'),

  markExtensionSlot(), // <<< Extension operations are inserted here

  ({ timestamp, message, ctx }) =>
    `${timestamp}${ctx ? ` (${ctx})` : ''}: ${message}`,
]);

mainLogger.info('Main logger test'); // 2029-05-02 11:18:41 (Main context): Main logger test

const subLogger = mainLogger.extend([addContext('Sub context')]);

subLogger.info('Sub logger test'); // 2029-05-02 11:18:41 (Main context > Sub context): Sub logger test
```

The utility function `logger.sub(context)` helps to easily create sub-loggers:

```js
const subLogger = mainLogger.sub('Sub context');
// Same as mainLogger.extend([addContext('Sub context')])
```

You can create and extend multiple slots by giving them different names.

```js
const mainLogger = new Logger([
  // ...

  markExtensionSlot(), // name: 'defaultSlot'

  ({ timestamp, level, message, ctx }) =>
    `${timestamp} [${level}]${ctx ? ` (${ctx})` : ''}: ${message}`,

  markExtensionSlot('slot2'),
]);

const subLogger = mainLogger.extend({
  defaultSlot: [addContext('server.ts')],

  slot2: [writeTo(new FileOutput('logs.txt'))],
});
```

## License

MIT
