import global from './global.json';

export interface AllowedHandlers {
  [handlerName: string]: number[];
}

const settings = [global].filter(config => config.enabled);

function getAllowedHandlers(settings): AllowedHandlers {
  return settings.reduce((prev, current) => {
    current.handlers?.forEach((handler) => {
      if (!prev[handler]) {
        prev[handler] = [];
      }

      prev[handler].push(current.chatId);
    });

    return prev;
  }, {});
}

export const allowedHandlers = getAllowedHandlers(settings);

