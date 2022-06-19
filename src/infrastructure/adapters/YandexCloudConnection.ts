import { Telegraf } from 'telegraf';
import { info, error } from '@/utils/logger';
import config from '@/infrastructure/config';

export function debug() {
  return JSON.stringify(config, null, 3);
}

export function handle(bot: Telegraf) {
  return async (event, context) => {
    try {
      const message = JSON.parse(event.body);

      info('event', JSON.stringify(event));
      info('context', JSON.stringify(context));

      await bot.handleUpdate(message);
    } catch (err) {
      error('Handle message error', err);
    }

    return {
      statusCode: 200,
      body: debug(),
    };
  }
}
