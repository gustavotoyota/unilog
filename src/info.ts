import type { LogLevel } from './levels';
import type { OUTPUT_SYMBOL, LEVEL_SYMBOL, SPLAT_SYMBOL } from './symbols';

export interface LogInfo {
  level: string;
  message: any;

  [LEVEL_SYMBOL]: LogLevel;
  [OUTPUT_SYMBOL]: any;
  [SPLAT_SYMBOL]: any[];

  [key: string | symbol]: any;
}
