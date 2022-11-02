import type { LogOperation } from './operation';

export const capitalizeField =
  (field: string): LogOperation =>
  (info) => {
    info[field] = String(info[field]).toUpperCase();
  };
