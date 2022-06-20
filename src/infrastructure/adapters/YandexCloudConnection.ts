import { Telegraf } from 'telegraf';
import { safeJsonParse } from '@/utils/json';

export function handle(bot: Telegraf) {
  return async (event, context) => {
    const message = safeJsonParse(event.body);
    await bot.handleUpdate(message);

    return {
      statusCode: 200,
      body: 'ok',
    };
  }
}
