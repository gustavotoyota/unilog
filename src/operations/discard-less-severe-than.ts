import type { LogLevel } from '../levels';
import { levels } from '../levels';
import { LEVEL_SYMBOL } from '../symbols';
import type { LogOperation } from './operation';

export const discardLessSevereThan =
  (level?: LogLevel | (() => LogLevel | undefined)): LogOperation =>
  (info) => {
    if (typeof level === 'function') {
      level = level();
    }

    if (level == null) {
      return;
    }

    if (levels[info[LEVEL_SYMBOL]] > levels[level]) {
      return null;
    }
  };
