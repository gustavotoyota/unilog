import type { LogLevel } from './levels';
import type { ARGS_SYMBOL, LEVEL_SYMBOL, OUTPUT_SYMBOL } from './symbols';

export interface LogInfo {
  level: string;
  message: any;

  [LEVEL_SYMBOL]: LogLevel;
  [OUTPUT_SYMBOL]: any;
  [ARGS_SYMBOL]: any[];

  [key: string | symbol]: any;
}
