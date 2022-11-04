import type { LogInfo } from './info';
import type { LogLevel } from './levels';
import { addContext } from './operations';
import type { LogExtensions, LogOperation } from './operations/operation';
import { LogStream } from './stream';
import { ARGS_SYMBOL, LEVEL_SYMBOL, OUTPUT_SYMBOL } from './symbols';
import { executeOperations } from './utils';

export interface LoggerOptions {
  baseLogger?: Logger;
  extensions?: LogExtensions;
}

export class Logger extends LogStream {
  baseLogger?: Logger;
  extensions?: LogExtensions;

  constructor(options?: LogOperation[] | LoggerOptions) {
    if (Array.isArray(options)) {
      super(options);
    } else {
      super();

      this.baseLogger = options?.baseLogger;
      this.extensions = options?.extensions;
    }
  }

  error(message: any, ...args: any[]) {
    this.log('error', message, ...args);
  }
  warn(message: any, ...args: any[]) {
    this.log('warn', message, ...args);
  }
  info(message: any, ...args: any[]) {
    this.log('info', message, ...args);
  }
  debug(message: any, ...args: any[]) {
    this.log('debug', message, ...args);
  }
  verbose(message: any, ...args: any[]) {
    this.log('verbose', message, ...args);
  }

  log(level: LogLevel, message: any, ...args: any[]): void {
    if (typeof message !== 'string') {
      args = [message, ...args];
      message = '%o';
    }

    const info: LogInfo = {
      level,
      message,

      [LEVEL_SYMBOL]: level,
      [OUTPUT_SYMBOL]: message,
      [ARGS_SYMBOL]: [],
    };

    // Collect arguments

    const argsLen = String(message).match(/%\w/g)?.length ?? 0;
    info[ARGS_SYMBOL] = args.slice(0, argsLen);

    // Merge remaining arguments into info

    for (let i = argsLen; i < args.length; i++) {
      Object.assign(info, args[i]);
    }

    this.write(info);
  }

  write(info: LogInfo, extensions: LogExtensions = {}) {
    if (this.baseLogger != null) {
      for (const key in this.extensions) {
        if (key in extensions) {
          extensions[key].unshift(...this.extensions[key]);
        } else {
          extensions[key] = this.extensions[key].slice();
        }
      }

      this.baseLogger.write(info, extensions);
    } else {
      executeOperations(info, this.operations, extensions);
    }
  }

  extend(extensions?: LogOperation[] | LogExtensions) {
    extensions ??= {};

    if (Array.isArray(extensions)) {
      extensions = { defaultSlot: extensions };
    }

    return new Logger({ baseLogger: this, extensions });
  }
  sub(context: string) {
    return this.extend([addContext(context)]);
  }
}
