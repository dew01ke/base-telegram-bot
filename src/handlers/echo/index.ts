import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { replyTo } from '@/utils/telegram';
import { Context } from '@/infrastructure/interfaces/Context';

export class Echo extends BaseHandler {
  public name: string = 'echo';

  async handleMessage(ctx: Context) {
    await replyTo(ctx, ctx.message.text);
  }
}
