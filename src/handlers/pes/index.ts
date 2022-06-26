import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Context } from '@/infrastructure/interfaces/Context';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';
import { handleCommand } from '@/utils/telegram';

export class Pes extends BaseHandler {
  public name: string = 'pes';

  @checkAdmin()
  async handleMention(ctx: Context, message: string) {
    handleCommand(message, /^(кто п[её]с дня)/i, async () => {
      const settings = this.getSettingsFromContext(ctx);

      if (settings.text) {
        await ctx.reply(settings.text);
      }
    });
  }
}
