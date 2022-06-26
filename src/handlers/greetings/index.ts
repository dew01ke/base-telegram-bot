import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { replyTo } from '@/utils/telegram';
import { Context } from '@/infrastructure/interfaces/Context';

export class Greetings extends BaseHandler {
  public name: string = 'greetings';

  async handleMessage(ctx: Context) {
    await replyTo(ctx, `Привет!`);
  }
}
