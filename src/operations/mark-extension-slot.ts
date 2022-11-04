import type { LogOperation } from './operation';

export function markExtensionSlot(
  slotName: string | LogOperation[] = 'defaultSlot',
  operations: LogOperation[] = [],
) {
  if (Array.isArray(slotName)) {
    operations = slotName;
    slotName = 'defaultSlot';
  }

  return { slotName, operations };
}
