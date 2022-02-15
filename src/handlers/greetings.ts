import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Context } from 'telegraf';

export class Greetings extends BaseHandler {
  async handleMessage(ctx: Context) {
    await ctx.reply('Привет!');
  }
}
