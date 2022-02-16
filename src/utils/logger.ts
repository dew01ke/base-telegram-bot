import config, { Mode } from '@/infrastructure/config';

function logger(type: string, ...args: any) {
  console[type](...args);
}

export function log(...args: any) {
  if (config.MODE === Mode.DEVELOPMENT) {
    logger('log', ...args);
  }
}

export function info(...args: any) {
  logger('info', ...args);
}

export function error(...args: any) {
  logger('error', ...args);
}