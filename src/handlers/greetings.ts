import { Context, Markup } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';

export class GreetingsHandler extends BaseHandler {
  public name: string = 'greetings';
  public answerAction: string = 'sayHello';

  async handleMessage(ctx: Context) {
    await ctx.reply(
      'Привет!',
      Markup.inlineKeyboard([
        Markup.button.callback('Поприветсвовать', this.answerAction),
      ])
    );
  }

  async handleCallbackQuery(ctx: Context, actionName: string) {
    await ctx.answerCbQuery();

    if (actionName === this.answerAction) {
      await ctx.reply(`${ctx.from.first_name} со мной поздоровался`);
    }
  }
}
