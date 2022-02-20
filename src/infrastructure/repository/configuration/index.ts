import all from './all.json';

export interface Configuration {
  enabled: boolean;
  chatId: number | null;
  admins: number[];
  handlers: string[];
}

export interface ActiveHandlers {
  [handlerName: string]: number[];
}

const settings: Configuration[] = [
  all
].filter(config => config.enabled);

function getActiveHandlers(settings: Configuration[]): ActiveHandlers {
  return settings.reduce((object, current) => {
    current.handlers?.forEach((handler) => {
      if (!object[handler]) {
        object[handler] = [];
      }

      object[handler].push(current.chatId);
    });

    return object;
  }, {});
}

export const activeHandlers = getActiveHandlers(settings);
