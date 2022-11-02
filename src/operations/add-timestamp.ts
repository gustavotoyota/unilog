import type { LogOperation } from './operation';

function padNum(num: number, numDigits: number) {
  return String(num).padStart(numDigits, '0');
}

export const addTimestamp = (): LogOperation => (info) => {
  const date = new Date();

  info.timestamp =
    [
      date.getFullYear(),
      padNum(date.getMonth() + 1, 2),
      padNum(date.getDate(), 2),
    ].join('-') +
    ' ' +
    [
      padNum(date.getHours(), 2),
      padNum(date.getMinutes(), 2),
      padNum(date.getSeconds(), 2),
    ].join(':');
};
