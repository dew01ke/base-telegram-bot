import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { replyTo } from '@/utils/telegram';

export class Greetings extends BaseHandler {
  public name: string = 'greetings';

  async handleMessage(ctx: Context) {
    await replyTo(ctx, `Привет!`);
  }
}
