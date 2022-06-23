import { Context, Markup } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';
import { parseMentionCommand } from '@/utils/telegram';

export class GreetingsHandler extends BaseHandler {
  public name: string = 'greetings';
  public greetingAction: string = 'greetingAction';
  public adminAction: string = 'adminAction';

  async handleMessage(ctx: Context) {
    const { command, payload } = parseMentionCommand(ctx);
    switch (command) {
      case 'help': {
        await ctx.reply('Чем помочь?');

        break;
      }

      case 'admin': {
        await this.notifyAdmin(ctx);

        break;
      }

      default: {
        await ctx.reply(
          'Привет!',
          Markup.inlineKeyboard([
            Markup.button.callback('Поприветсвовать', this.greetingAction)
          ])
        );
      }
    }
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
