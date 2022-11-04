import type { LogInfo } from './info';
import type { LogExtensions, LogOperation } from './operations/operation';

export abstract class LogStream {
  constructor(readonly operations: LogOperation[] = []) {}

  abstract write(info: LogInfo, extensions: LogExtensions): any;
}
