import 'reflect-metadata';
import { Context, Telegraf } from 'telegraf';
import { COMMON_EVENT_NAME, EventEmitter, Events } from '@/utils/events';
import { handle } from '@/infrastructure/adapters/YandexCloudConnection';
import { info } from '@/utils/logger';
import config from '@/infrastructure/config';
import Handlers from '@/handlers';

const bot = new Telegraf(config.BOT_TOKEN);
const events = new EventEmitter();
const handlers = Handlers.map(Handler => (new Handler(events)).name);

[
  Events.MESSAGE,
  Events.CALLBACK_QUERY,
  Events.INLINE_QUERY,
].forEach((eventName) => {
  bot.on(eventName as any, (ctx: Context) => {
    events.emit(eventName, ctx);
  });
});

[
  Events.TEXT,
  Events.EDITED_MESSAGE,
  Events.POLL_ANSWER,
  Events.PHOTO ,
  Events.VIDEO,
  Events.VIDEO_NOTE,
  Events.VOICE,
  Events.AUDIO,
].forEach((eventName) => {
  bot.on(eventName, (ctx: Context) => {
    events.emit(COMMON_EVENT_NAME, ctx);
  });
});

info(`Bot has been started! Polling flag: ${config.BOT_USE_POLLING}`);
info(`Available handlers: ${handlers.length} => ${handlers}`);

if (config.BOT_USE_POLLING) {
  bot.launch();
}

module.exports.handler = handle(bot);