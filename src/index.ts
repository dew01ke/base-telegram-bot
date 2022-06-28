import 'reflect-metadata';
import { Telegraf } from 'telegraf';
import { COMMON_EVENT_NAME, EventEmitter, BASE_EVENTS, COMMON_EVENTS } from '@/utils/events';
import { handle } from '@/infrastructure/adapters/YandexCloudConnection';
import { log } from '@/utils/logger';
import { Database } from '@/infrastructure/database';
import { Configuration } from '@/infrastructure/entities/Configuration';
import { getChatId } from '@/utils/telegram';
import { Context } from '@/infrastructure/interfaces/Context';
import config from '@/infrastructure/config';
import Handlers from '@/handlers';

const bot = new Telegraf(config.BOT_TOKEN);
const events = new EventEmitter();
const handlers = Handlers.map(Handler => (new Handler(bot, events)).name);

bot.use(async (ctx: Context, next) => {
  const configurationRepository = Database.getRepository(Configuration);

  const configurations = await configurationRepository.findBy({
    enabled: true,
    chatId: getChatId(ctx),
    botName: ctx.botInfo.username
  });

  ctx.configurations = configurations.reduce((configurations, configuration) => {
    configurations[configuration.name] = configuration;

    return configurations;
  }, {});

  await next();
});

BASE_EVENTS.forEach((eventName) => {
  bot.on(eventName, (ctx: Context) => {
    events.emit(eventName, ctx);
  });
});

COMMON_EVENTS.forEach((eventName) => {
  bot.on(eventName, (ctx: Context) => {
    events.emit(COMMON_EVENT_NAME, ctx);
  });
});

log(`Bot has been started! Polling flag: ${config.BOT_USE_POLLING}`);
log(`Available handlers: ${handlers.length} => ${handlers}`);

if (config.BOT_USE_POLLING) {
  bot.launch();
}

module.exports.handler = handle(bot, events);