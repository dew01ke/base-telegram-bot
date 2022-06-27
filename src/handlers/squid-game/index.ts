import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import { getAction, getModifications } from '@/handlers/squid-game/utils/messageDecomposition';
import { getChatId, getUserId, handleCommand, replyTo } from '@/utils/telegram';
import { calculateScoreByUsers, MemberScore } from '@/handlers/squid-game/utils/calculateScore';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';
import { Context } from '@/infrastructure/interfaces/Context';

const NO_ACCESS_TEXT = 'У тебя нет доступа, пёс.';

export class SquidGame extends BaseHandler {
  public name: string = 'squid-game';

  get day(): number {
    return (new Date()).getDate();
  }

  get month(): number {
    return (new Date()).getMonth() + 1;
  }

  async handleMention(ctx: Context, message: string) {
    handleCommand(message, /^(активность)/i, async (chatId) => {
      const targetChatId = parseInt(chatId, 10);

      await this.replyWithScore(ctx, targetChatId);
    });

    handleCommand(message, /^(запустить игру)/i, async () => {
      await this.replyAndToggleGameState(ctx, true);
    });

    handleCommand(message, /^(остановить игру)/i, async () => {
      await this.replyAndToggleGameState(ctx, false);
    });
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

  async buildScoreTable(ctx: Context, targetChatId?: number): Promise<MemberScore[]> {
    const chatId = targetChatId || getChatId(ctx);
    const activityRepository = Database.getRepository(Activity);
    const activities = await activityRepository.findBy({
      month: this.month,
      chatId,
    });

    return calculateScoreByUsers(activities);
  }

  @checkAdmin(NO_ACCESS_TEXT)
  async replyWithScore(ctx: Context, targetChatId?: number) {
    const chatId = targetChatId || getChatId(ctx);
    const memberScores = await this.buildScoreTable(ctx, chatId);
    const members = [];

    for (const memberScore of memberScores) {
      const member = await ctx.telegram.getChatMember(chatId, memberScore.userId);
      const username = member.user.username || member.user.first_name;
      members.push(`${member.user.first_name} (${username}) → ${memberScore.score}`);
    }

    await replyTo(ctx, members.join('\n'));
  }

  @checkAdmin(NO_ACCESS_TEXT)
  async replyAndToggleGameState(ctx: Context, active: boolean) {
    await this.saveSettings(ctx, { active });
    await replyTo(ctx, active ? 'Игра запущена': 'Игра остановлена');
  }
}
