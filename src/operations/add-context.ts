import type { LogOperation } from './operation';

export const addContext =
  (context: string): LogOperation =>
  (info) => {
    if (typeof info.ctx === 'string') {
      info.ctx += ` > ${context}`;
    } else {
      info.ctx = context;
    }
  };
