import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import { getAction, getModifications } from '@/handlers/squid-game/utils/messageDecomposition';
import { getChatId, getUserId, replyTo } from '@/utils/telegram';
import { calculateScoreByUsers, MemberScores } from '@/handlers/squid-game/utils/calculateScore';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';
import { Context } from '@/infrastructure/interfaces/Context';

export class SquidGame extends BaseHandler {
  public name: string = 'squid-game';

  get day(): number {
    return (new Date()).getDate();
  }

  get month(): number {
    return (new Date()).getMonth() + 1;
  }

  @checkAdmin
  async handleCommand(ctx: Context, name: string, payload: string[]) {
    if (name === 'активность') {
      await this.replyWithScore(ctx);
    }
  }

  async handleMessage(ctx: Context) {
    await this.extractMemberAction(ctx);
  }

  async handleCommonEvent(ctx: Context) {
    await this.extractMemberAction(ctx);
  }

  async extractMemberAction(ctx: Context) {
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

  async buildScoreTable(ctx: Context): Promise<MemberScores> {
    const activityRepository = Database.getRepository(Activity);
    const activities = await activityRepository.findBy({
      month: this.month,
      chatId: getChatId(ctx)
    });

    return calculateScoreByUsers(activities);
  }

  async replyWithScore(ctx: Context) {
    const memberScores = await this.buildScoreTable(ctx);
    const members = [];

    for (const memberScore of Object.values(memberScores)) {
      const member = await ctx.telegram.getChatMember(getChatId(ctx), memberScore.userId);
      members.push(`${member.user.first_name} ${member.user.last_name} (${member.user.username}) - ${memberScore.score}`);
    }

    const settings = this.getSettingsFromContext(ctx);

    await replyTo(ctx, members.join('\n') + JSON.stringify(settings));
  }
}
