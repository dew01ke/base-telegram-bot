import { Context, Markup } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';

export class GreetingsHandler extends BaseHandler {
  public name: string = 'greetings';
  public greetingAction: string = 'greetingAction';
  public adminAction: string = 'adminAction';

  async handleMessage(ctx: Context) {
    await ctx.reply(
      'Привет!',
      Markup.inlineKeyboard([
        Markup.button.callback('Поприветсвовать', this.greetingAction),
        Markup.button.callback('Только для админов', this.adminAction),
      ])
    );
  }

  async handleCallbackQuery(ctx: Context, actionName: string) {
    await ctx.answerCbQuery();

    if (actionName === this.greetingAction) {
      await ctx.reply(`${ctx.from.first_name} со мной поздоровался`);
    }

    if (actionName === this.adminAction) {
      await this.notifyAdmin(ctx);
    }
  }

  @checkAdmin
  async notifyAdmin(ctx: Context) {
    await ctx.reply(`Я знаю, что ты админ`);
  }
}
