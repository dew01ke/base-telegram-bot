import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import { getAction, getModifications } from '@/handlers/squid-game/utils/activityTagger';
import { getChatId, getUserId, replyTo } from '@/utils/telegram';
import { calculateScoreByUsers } from '@/handlers/squid-game/utils/calculateScore';
import { checkAdmin } from "@/infrastructure/decorators/checkAdmin";

export class SquidGame extends BaseHandler {
  public name: string = 'squid-game';

  get day(): number {
    return (new Date()).getDate();
  }

  get month(): number {
    return (new Date()).getMonth() + 1;
  }

  @checkAdmin
  async handleCommand(ctx: Context, name: string) {
    if (name === 'активность') {
      await this.replyWithScore(ctx);
    }
  }

  async handleMessage(ctx: Context) {
    await this.extractAction(ctx);
  }

  async handleCommonEvent(ctx: Context) {
    await this.extractAction(ctx);
  }

  async extractAction(ctx: Context) {
    const activityRepository = Database.getRepository(Activity);

    const activity = new Activity();
    activity.chatId = getChatId(ctx);
    activity.userId = getUserId(ctx);
    activity.day = this.day;
    activity.month = this.month;
    activity.action = getAction(ctx);
    activity.modifications = getModifications(ctx);

    await activityRepository.insert(activity);
  }

  async replyWithScore(ctx: Context) {
    const activityRepository = Database.getRepository(Activity);
    const activities = await activityRepository.findBy({
      month: this.month,
      chatId: getChatId(ctx)
    });
    const scores = calculateScoreByUsers(activities);
    const message = Object.entries(scores).map(([userId, score]) => {
      return `${userId} = ${score}`;
    }).join('\r\n');

    await replyTo(ctx, message);
  }
}
