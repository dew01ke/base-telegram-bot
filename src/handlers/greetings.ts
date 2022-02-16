import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';

export class GreetingsHandler extends BaseHandler {
  public name: string = 'greetings';

  async handleMessage(ctx: Context) {
    await ctx.reply('Привет!');
  }
}
