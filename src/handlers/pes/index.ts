import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Context } from '@/infrastructure/interfaces/Context';
import { handleCommand } from '@/utils/telegram';

export class Pes extends BaseHandler {
  public name: string = 'pes';

  async handleMention(ctx: Context, message: string) {
    handleCommand(message, /^(кто п[её]с дня)/i, async () => {
      await this.replyWithPes(ctx);
    });
  }

  private async replyWithPes(ctx: Context) {
    const settings = this.getSettings(ctx);

    if (settings.text) {
      await ctx.reply(settings.text);
    }
  }
}
