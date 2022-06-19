import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';

export class UserInfoHandler extends BaseHandler {
  public name: string = 'userInfo';

  async handleMessage(ctx: Context) {
    await ctx.reply(
      `${ctx.from.id} // ${ctx.from.username} // ${ctx.from.language_code}`
    );
  }
}
