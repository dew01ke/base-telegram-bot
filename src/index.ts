import { Context, Telegraf } from 'telegraf';
import { EventEmitter, Events } from '@/utils/events';
import { activeHandlers } from '@/infrastructure/repository/configuration';
import { setup, handle } from '@/infrastructure/adapters/YandexCloudConnection';
import { info } from '@/utils/logger';
import config from '@/infrastructure/config';
import Handlers from '@/handlers';

const bot = new Telegraf(config.BOT_TOKEN);
const events = new EventEmitter();
const handlers = Handlers.map(Handler => (new Handler(events, activeHandlers)).name);

[Events.MESSAGE, Events.CALLBACK_QUERY, Events.INLINE_QUERY].forEach((eventName) => {
  bot.on(eventName, (ctx: Context) => {
    events.emit(eventName, ctx);
  });
});

info(`Bot has been started!`);
info(`Available handlers: ${handlers.length} => ${handlers}`);

if (config.BOT_USE_POLLING) {
  bot.launch();
} else {
  setup(bot);
}

module.exports.handler = handle(bot);