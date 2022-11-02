import type { LogStream } from '../stream';
import { executeOperations } from '../utils';
import type { LogExtensions, LogOperation } from './operation';

export const writeTo = (stream: LogStream): LogOperation =>
  function (this: LogExtensions, info) {
    const result = executeOperations(info, stream.operations, this);

    if (result === false) {
      return false;
    }

    stream.write?.(result);
  };
