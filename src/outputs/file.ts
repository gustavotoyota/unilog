import type { WriteStream } from 'fs';

import type { LogInfo } from '../info';
import { LogOperation } from '../operations';
import { LogStream } from '../stream';
import { OUTPUT_SYMBOL } from '../symbols';

let fsPromise: Promise<typeof import('fs')>;

if (typeof window === 'undefined') {
  fsPromise = import('fs');
}

export class FileOutput extends LogStream {
  readonly _path: string;
  readonly _writeStream: Promise<WriteStream>;

  constructor(options: { path: string; operations?: LogOperation[] }) {
    super(options.operations);

    this._path = options.path;

    this._writeStream = fsPromise.then((fs) =>
      fs.createWriteStream(this._path, { flags: 'a' }),
    );
  }

  override async write(info: LogInfo) {
    (await this._writeStream).write(info[OUTPUT_SYMBOL]);
  }
}
