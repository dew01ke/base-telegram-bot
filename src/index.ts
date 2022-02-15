import { Context, Telegraf } from 'telegraf';
import config from '@/infrastructure/config';
import Handlers from '@/handlers';
import { EventEmitter, Events } from '@/events';

const bot = new Telegraf(config.BOT_TOKEN);
const events = new EventEmitter();
const handlers = Handlers.map(Handler => new Handler(events));

bot.on('message', (ctx: Context) => {
  events.emit(Events.MESSAGE, ctx);
});

bot.launch();
console.log('Application has been started!');