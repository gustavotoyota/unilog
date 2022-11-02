# UniLogr: the Universal Logger

[![Version npm](https://img.shields.io/npm/v/unilogr.svg?logo=npm)](https://www.npmjs.com/package/unilogr)

UniLogr is a logger for both Node.js and Browser based on Winston.
It's simple, but powerful.

## Usage

A logger is constructed with a sequence of operations.
`writeTo` is used to write a log to an output stream.

### Creating a logger

```js
import { Logger } from 'unilogr';
import {
  addMilliseconds,
  addTimestamp,
  capitalizeField,
  colorizeField,
  markExtensionSlot,
  writeTo,
} from 'unilogr/operations';
import { ConsoleOutput } from 'unilogr/outputs';

const logger = new Logger([
  capitalizeField('level'),
  colorizeField('level'),
  addTimestamp(),
  addMilliseconds(),

  markExtensionSlot(),

  ({ timestamp, level, message, ctx, ms }) =>
    `${timestamp} [${level}]${ctx ? ` (${ctx})` : ''}: ${message} (${ms})`,

  writeTo(new ConsoleOutput()),
]);

logger.info('Test'); // 2022-11-01 19:11:47 [INFO]: Test (+0ms)
```

### Logging methods

UnoLogr uses the following logging levels:

```js
logger.error('Error');
logger.warn('Warn');
logger.info('Info');
logger.debug('Debug');
logger.verbose('Verbose');
```

### Logging

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

### Extending a logger

A logger can be extended with more operations.
Operations can be added in slots marked by `markExtensionSlot()`.

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

You can create and extend multiple slots by giving them different names.

```js
const mainLogger = new Logger([
  // ...

  markExtensionSlot(), // name: 'defaultSlot'

  ({ timestamp, level, message, ctx, ms }) =>
    `${timestamp} [${level}]${ctx ? ` (${ctx})` : ''}: ${message} (${ms})`,

  markExtensionSlot('slot2'),
]);

const subLogger = mainLogger.extend({
  defaultSlot: [addContext('server.ts')],

  slot2: [writeTo(new FileOutput('logs.txt'))],
});
```
