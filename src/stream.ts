import type { LogInfo } from './info';
import type { LogOperation } from './operations/operation';

export class LogStream {
  operations: LogOperation[];

  constructor(operations?: LogOperation[]) {
    this.operations = operations ?? [];
  }

  write?(info: LogInfo): any;
}
