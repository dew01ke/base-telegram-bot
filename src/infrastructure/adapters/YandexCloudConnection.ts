import { Telegraf } from 'telegraf';
import { info, error } from '@/utils/logger';
import config from '@/infrastructure/config';

export function setup(bot: Telegraf) {
  bot.telegram.deleteWebhook();
  bot.telegram.setWebhook(`https://functions.yandexcloud.net/${config.FUNCTION_ID}`);
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
      body: '',
    };
  }
}
