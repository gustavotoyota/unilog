import type { LogInfo } from './info';
import type {
  LogExtensions,
  LogOperation,
  LogOperationResult,
} from './operations/operation';
import { FINAL_MESSAGE_SYMBOL } from './symbols';

export function executeOperations(
  info: LogInfo,
  operations: LogOperation[],
  extensions: LogExtensions,
): LogInfo | false {
  const checkedSlots = new Set<string>();

  for (const operation of operations) {
    let result: LogOperationResult;

    if (typeof operation === 'function') {
      result = operation.call(extensions, info);
    } else {
      if (checkedSlots.has(operation.slotName)) {
        continue;
      }

      checkedSlots.add(operation.slotName);

      result = executeOperations(
        info,
        extensions?.[operation.slotName] ?? [],
        extensions,
      );
    }

    if (result === false) {
      return false;
    }

    if (typeof result === 'string') {
      info[FINAL_MESSAGE_SYMBOL] = result;
    } else if (typeof result === 'object') {
      info = result;
    }
  }

  return info;
}
