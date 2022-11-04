import { escapeColorToCSS } from '../colors';
import type { LogInfo } from '../info';
import { LogStream } from '../stream';
import { ARGS_SYMBOL, LEVEL_SYMBOL, OUTPUT_SYMBOL } from '../symbols';

export class ConsoleOutput extends LogStream {
  override write(info: LogInfo) {
    // Pre-processing for Firefox
    // (Firefox doesn't support ANSI color escapes)

    if (
      typeof info[OUTPUT_SYMBOL] === 'string' &&
      globalThis.navigator?.userAgent.toLowerCase().indexOf('firefox') >= 0
    ) {
      const escapeColors: string[] = [];

      info[OUTPUT_SYMBOL] = info[OUTPUT_SYMBOL].replaceAll(
        /\x1b\[\d+m/g,
        (match) => {
          escapeColors.push(match);

          return '%c';
        },
      );

      let colorIndex = 0;
      let argIndex = 0;

      info[OUTPUT_SYMBOL] = info[OUTPUT_SYMBOL].replaceAll(/%\w/g, (match) => {
        if (match === '%c') {
          const escapeColor = escapeColors[colorIndex++];

          info[ARGS_SYMBOL].splice(argIndex, 0, escapeColorToCSS[escapeColor]);
        }

        argIndex++;

        return match;
      });
    }

    if (info[LEVEL_SYMBOL] === 'error') {
      console.error(info[OUTPUT_SYMBOL], ...info[ARGS_SYMBOL]);
    } else if (info[LEVEL_SYMBOL] === 'warn') {
      console.warn(info[OUTPUT_SYMBOL], ...info[ARGS_SYMBOL]);
    } else if (info[LEVEL_SYMBOL] === 'info') {
      console.info(info[OUTPUT_SYMBOL], ...info[ARGS_SYMBOL]);
    } else {
      console.debug(info[OUTPUT_SYMBOL], ...info[ARGS_SYMBOL]);
    }
  }
}
