import type { LogStream } from '../stream';
import { executeOperations } from '../utils';
import type { LogExtensions, LogOperation } from './operation';

export const writeTo = (stream: LogStream): LogOperation =>
  function (this: { extensions: LogExtensions }, info) {
    const result = executeOperations(info, stream.operations, this.extensions);

    if (result === false) {
      return false;
    }

    stream.write(result, this.extensions);
  };
