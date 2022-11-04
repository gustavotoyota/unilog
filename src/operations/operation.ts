import type { LogInfo } from '../info';

export type LogOperationResult = LogInfo | string | boolean | void;
export type LogOperation =
  | ((info: LogInfo) => LogOperationResult)
  | { slotName: string; operations: LogOperation[] };

export type LogExtensions = Record<string, LogOperation[]>;
