import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { calculateScore } from '@/handlers/scoring/utils/calculateScore';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';

export class ScoringHandler extends BaseHandler {
  public name: string = 'scoring';

  @checkAdmin
  async handleMessage(ctx: Context) {
    await this.calculateAndAnswer(ctx);
  }

  async handleCommonEvent(ctx: Context) {
    await this.calculateAndAnswer(ctx);
  }

  async calculateAndAnswer(ctx: Context) {
    const score = calculateScore(ctx);

    await ctx.reply(`Your score is ${score}`);
  }
}
