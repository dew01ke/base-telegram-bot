import { Telegraf } from 'telegraf';
import { EventEmitter, SCHEDULER_EVENT_NAME } from '@/utils/events';
import { safeJsonParse } from '@/utils/json';

function isTriggerEvent(event) {
  return event?.messages?.[0]?.details?.trigger_id;
}

export function handle(bot: Telegraf, events: EventEmitter) {
  return async (event) => {
    if (isTriggerEvent(event)) {
      return events.emit(SCHEDULER_EVENT_NAME);
    }

    const update = safeJsonParse(event.body);
    await bot.handleUpdate(update);

    return {
      statusCode: 200,
      body: 'ok',
    };
  }
}
