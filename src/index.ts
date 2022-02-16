import { Context, Telegraf } from 'telegraf';
import { EventEmitter, Events } from '@/events';
import { info } from '@/utils/logger';
import config from '@/infrastructure/config';
import { allowedHandlers } from '@/infrastructure/repository';
import Handlers from '@/handlers';

const bot = new Telegraf(config.BOT_TOKEN);
const events = new EventEmitter();
const handlers = Handlers.map(Handler => (new Handler(events, allowedHandlers)).name);

[Events.MESSAGE, Events.CALLBACK_QUERY, Events.INLINE_QUERY].forEach((eventName) => {
  bot.on(eventName, (ctx: Context) => {
    events.emit(eventName, ctx);
  });
});

bot.launch();
info(`Bot has been started!`);
info(`Available handlers: ${handlers.length} => ${handlers}`);