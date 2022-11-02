import type { LogInfo } from '../info';

export type LogOperationResult = LogInfo | string | false | void;
export type LogOperation =
  | ((info: LogInfo) => LogOperationResult)
  | { slotName: string };

export type LogExtensions = Record<string, LogOperation[]>;
