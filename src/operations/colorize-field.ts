import { EscapeColors } from '../colors';
import type { LogInfo } from '../info';
import { LEVEL_SYMBOL } from '../symbols';

export const colorizeField = (field: string) => (info: LogInfo) => {
  if (info[LEVEL_SYMBOL] === 'info') {
    info[field] = `${EscapeColors.FgGreen}${info[field]}${EscapeColors.Reset}`;
  } else if (info[LEVEL_SYMBOL] === 'warn') {
    info[field] = `${EscapeColors.FgYellow}${info[field]}${EscapeColors.Reset}`;
  } else if (info[LEVEL_SYMBOL] === 'error') {
    info[field] = `${EscapeColors.FgRed}${info[field]}${EscapeColors.Reset}`;
  } else if (info[LEVEL_SYMBOL] === 'debug') {
    info[field] = `${EscapeColors.FgCyan}${info[field]}${EscapeColors.Reset}`;
  } else if (info[LEVEL_SYMBOL] === 'verbose') {
    info[
      field
    ] = `${EscapeColors.FgMagenta}${info[field]}${EscapeColors.Reset}`;
  } else if (info[LEVEL_SYMBOL] === 'silly') {
    info[field] = `${EscapeColors.FgWhite}${info[field]}${EscapeColors.Reset}`;
  } else {
    info[field] = `${EscapeColors.FgBlue}${info[field]}${EscapeColors.Reset}`;
  }
};
