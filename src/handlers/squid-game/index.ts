import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Score } from '@/handlers/squid-game/entities/Score';
import { buildActivityTags, calculateScore } from '@/handlers/squid-game/utils/calculateScore';
import { getChatId, getUserId } from '@/utils/telegram';

export class SquidGame extends BaseHandler {
  public name: string = 'squid-game';

  async handleMessage(ctx: Context) {
    await this.calculateMessage(ctx);
  }

  async handleCommonEvent(ctx: Context) {
    await this.calculateMessage(ctx);
  }

  async calculateMessage(ctx: Context) {
    const scoreRepository = Database.getRepository(Score);

    const score = new Score();
    score.chatId = getChatId(ctx);
    score.userId = getUserId(ctx);
    score.day = calculateScore(ctx);
    score.tags = buildActivityTags(ctx);

    await scoreRepository.insert(score);
  }
}
