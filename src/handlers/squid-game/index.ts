import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Score } from '@/handlers/squid-game/entities/Score';
import { buildActivityTags} from '@/handlers/squid-game/utils/activityTagger';
import { getChatId, getUserId } from '@/utils/telegram';
import { calculateScoreByActivity } from '@/handlers/squid-game/utils/calculateScore';

export class SquidGame extends BaseHandler {
  public name: string = 'squid-game';

  async handleMessage(ctx: Context) {
    await this.tagMessage(ctx);
    await this.calculateScore(ctx);
  }

  async handleCommonEvent(ctx: Context) {
    await this.tagMessage(ctx);
  }

  async tagMessage(ctx: Context) {
    const scoreRepository = Database.getRepository(Score);

    const score = new Score();
    score.chatId = getChatId(ctx);
    score.userId = getUserId(ctx);
    score.day = (new Date()).getDate();
    score.tags = buildActivityTags(ctx);

    await scoreRepository.insert(score);
  }

  async calculateScore(ctx: Context) {
    const scoreRepository = Database.getRepository(Score);

    const scores = await scoreRepository.findBy({
      day: (new Date()).getDate(),
      chatId: getChatId(ctx)
    });

    const activityByUser = scores.reduce((tags, score) => {
      if (!tags[score.userId]) {
        tags[score.userId] = {
          score: 0,
          tags: [],
        };
      }

      tags[score.userId].tags = tags[score.userId].tags.concat(score.tags);

      return tags;
    }, {});

    for (let userId in activityByUser) {
      activityByUser[userId].score = calculateScoreByActivity(activityByUser[userId].tags);
    }

    console.log(activityByUser);
  }
}
