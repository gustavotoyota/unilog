import type { LogOperation } from './operation';

export const addInterval = (): LogOperation => {
  let prevTime: number;

  return (info) => {
    prevTime ??= Date.now();

    const currTime = Date.now();

    info.interval = `+${currTime - prevTime}ms`;

    prevTime = currTime;
  };
};
