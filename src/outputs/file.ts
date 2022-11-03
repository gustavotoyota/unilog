import type { WriteStream } from 'fs';

import type { LogInfo } from '../info';
import { LogOperation } from '../operations';
import { LogStream } from '../stream';
import { ARGS_SYMBOL } from '../symbols';

let fsPromise: Promise<typeof import('fs')>;
let utilPromise: Promise<typeof import('node:util')>;

if (typeof window === 'undefined') {
  fsPromise = import('fs');
  utilPromise = import('node:util');
}

export class FileOutput extends LogStream {
  readonly _path: string;
  readonly _writeStream: Promise<WriteStream>;

  constructor(options: { path: string; operations?: LogOperation[] }) {
    super(options.operations);

    this._path = options.path;

    this._writeStream = fsPromise?.then((fs) =>
      fs.createWriteStream(this._path, { flags: 'a' }),
    );
  }

  override async write(info: LogInfo) {
    const textOutput = (await utilPromise)?.format(
      info.message,
      ...info[ARGS_SYMBOL],
    );

    (await this._writeStream)?.write(textOutput);
  }
}
