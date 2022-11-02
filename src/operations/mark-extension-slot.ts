import type { LogOperation } from './operation';

export const markExtensionSlot = (slotName = 'defaultSlot'): LogOperation => {
  return { slotName };
};
