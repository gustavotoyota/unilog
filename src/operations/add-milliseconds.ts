import type { LogOperation } from './operation';

export const addMilliseconds = (): LogOperation => {
  let prevTime: number;

  return (info) => {
    prevTime ??= Date.now();

    const currTime = Date.now();

    info.ms = `+${currTime - prevTime}ms`;

    prevTime = currTime;
  };
};
