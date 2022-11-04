import { colorizeTextByLogLevel } from '../colors';
import type { LogInfo } from '../info';
import { LEVEL_SYMBOL } from '../symbols';

export const colorizeField = (field: string) => (info: LogInfo) => {
  info[field] = colorizeTextByLogLevel(info[field], info[LEVEL_SYMBOL]);
};
