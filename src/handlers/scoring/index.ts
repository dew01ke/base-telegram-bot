import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { buildActivityTags, calculateScore } from '@/handlers/scoring/utils/calculateScore';

export class ScoringHandler extends BaseHandler {
  public name: string = 'scoring';

  async handleMessage(ctx: Context) {
    await this.calculateMessage(ctx);
  }

  async handleCommonEvent(ctx: Context) {
    await this.calculateMessage(ctx);
  }

  async calculateMessage(ctx: Context) {
    console.log('score', buildActivityTags(ctx), calculateScore(ctx));
  }
}
