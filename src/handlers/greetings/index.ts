import { Context, Markup } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';

export class GreetingsHandler extends BaseHandler {
  public name: string = 'greetings';
  public greetingAction: string = 'sayHello';

  async handleMessage(ctx: Context) {
    await ctx.reply(
      'Привет!',
      Markup.inlineKeyboard([
        Markup.button.callback('Поприветсвовать', this.greetingAction),
      ])
    );
  }

  async handleCallbackQuery(ctx: Context, actionName: string) {
    await ctx.answerCbQuery();

    if (actionName === this.greetingAction) {
      await ctx.reply(`${ctx.from.first_name} со мной поздоровался`);
    }
  }
}
