import type { LogInfo } from './info';
import type { LogLevel } from './levels';
import { addContext } from './operations';
import type { LogExtensions, LogOperation } from './operations/operation';
import { FINAL_MESSAGE_SYMBOL, LEVEL_SYMBOL, SPLAT_SYMBOL } from './symbols';
import { executeOperations } from './utils';

export interface LoggerOptions {
  baseLogger?: Logger;
  extensions?: LogExtensions;
}

export class Logger {
  operations?: LogOperation[];

  baseLogger?: Logger;
  extensions?: LogExtensions;

  constructor(options?: LogOperation[] | LoggerOptions) {
    if (Array.isArray(options)) {
      this.operations = options;
      this.operations.push({ slotName: 'defaultSlot' });
    } else {
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
      [FINAL_MESSAGE_SYMBOL]: message,
      [SPLAT_SYMBOL]: [],
    };

    const splatLen = String(message).match(/%\w/g)?.length ?? 0;
    info[SPLAT_SYMBOL] = args.slice(0, splatLen);

    for (let i = splatLen; i < args.length; i++) {
      Object.assign(info, args[i]);
    }

    this._process(info);
  }

  private _process(info: LogInfo, extensions: LogExtensions = {}) {
    if (this.baseLogger != null) {
      for (const key in this.extensions) {
        if (key in extensions) {
          extensions[key].unshift(...this.extensions[key]);
        } else {
          extensions[key] = this.extensions[key].slice();
        }
      }

      this.baseLogger._process(info, extensions);
    } else {
      executeOperations(info, this.operations ?? [], extensions);
    }
  }

  extend(extensions: LogOperation[] | LogExtensions) {
    if (Array.isArray(extensions)) {
      extensions = { defaultSlot: extensions };
    }

    return new Logger({ baseLogger: this, extensions });
  }

  sub(context: string) {
    return this.extend([addContext(context)]);
  }
}
