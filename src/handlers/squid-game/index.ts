import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import { getAction, getModifications } from '@/handlers/squid-game/utils/messageDecomposition';
import { getChatId, getUserId, replyTo } from '@/utils/telegram';
import { calculateScoreByUsers, MemberScore } from '@/handlers/squid-game/utils/calculateScore';
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

  @checkAdmin('У тебя нет доступа, пёс.')
  async handleCommand(ctx: Context, name: string, payload: string[]) {
    switch (name) {
      case 'активность': {
        return await this.replyWithScore(ctx);
      }

      case 'запустить': {
        await this.toggleGameState(ctx, true)

        return replyTo(ctx, 'Игра запущена');
      }

      case 'остановить': {
        await this.toggleGameState(ctx, false);

        return replyTo(ctx, 'Игра остановлена');
      }
    }
  }

  private isActive(ctx: Context) {
    const settings = this.getSettingsFromContext(ctx);

    return settings.active;
  }

  async handleMessage(ctx: Context) {
    if (this.isActive(ctx)) {
      await this.extractMemberAction(ctx);
    }
  }

  async handleCommonEvent(ctx: Context) {
    if (this.isActive(ctx)) {
      await this.extractMemberAction(ctx);
    }
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

  async buildScoreTable(ctx: Context): Promise<MemberScore[]> {
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

    for (const memberScore of memberScores) {
      const member = await ctx.telegram.getChatMember(getChatId(ctx), memberScore.userId);
      const username = member.user.username || member.user.first_name;
      members.push(`${member.user.first_name} (${username}) → ${memberScore.score}`);
    }

    await replyTo(ctx, members.join('\n'));
  }

  async toggleGameState(ctx: Context, active) {
    await this.saveSettings(ctx, { active });
  }
}
