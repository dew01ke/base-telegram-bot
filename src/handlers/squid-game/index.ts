import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import { Actions, getAction, getModifications, Modifications } from '@/handlers/squid-game/utils/messageDecomposition';
import { getChatId, getUserId, handleCommand, handleSchedule, replyTo } from '@/utils/telegram';
import { calculateScoreByUsers, UserScore } from '@/handlers/squid-game/utils/calculateScore';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';
import { Context } from '@/infrastructure/interfaces/Context';
import { Configuration } from '@/infrastructure/entities/Configuration';

const FORBIDDEN_MESSAGE = 'У тебя нет доступа, пёс.';

export class SquidGame extends BaseHandler {
  public name: string = 'squid-game';

  private get day(): number {
    return (new Date()).getDate();
  }

  private get month(): number {
    return (new Date()).getMonth() + 1;
  }

  private isActive(ctx: Context) {
    const settings = this.getSettings(ctx);

    return settings.active;
  }

  async handleMention(ctx: Context, message: string) {
    handleCommand(message, /^(покажи результаты)/i, async (chatId) => {
      const targetChatId = parseInt(chatId, 10);

      await this.replyWithScore(ctx, targetChatId);
    });

    handleCommand(message, /^(запусти игру)/i, async () => {
      await this.replyAndToggleGameState(ctx, true);
    });

    handleCommand(message, /^(останови игру)/i, async () => {
      await this.replyAndToggleGameState(ctx, false);
    });
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

  async handleSchedulerEvent() {
    handleSchedule(20, async () => {
      await this.decreaseActivityScore();
    });
  }

  private async extractMemberAction(ctx: Context) {
    await this.createMemberAction(
      getChatId(ctx),
      getUserId(ctx),
      getAction(ctx),
      getModifications(ctx)
    );
  }

  private async createMemberAction(
    chatId: number,
    userId: number,
    action: Actions,
    modifications: Modifications[]
  ) {
    const activityRepository = Database.getRepository(Activity);

    const activity = new Activity();
    activity.chatId = chatId;
    activity.userId = userId;
    activity.day = this.day;
    activity.month = this.month;
    activity.action = action;
    activity.modifications = modifications;

    await activityRepository.insert(activity);
  }

  private async buildScoreTable(ctx?: Context, targetChatId?: number): Promise<UserScore[]> {
    const chatId = targetChatId || getChatId(ctx);
    const activityRepository = Database.getRepository(Activity);
    const activities = await activityRepository.findBy({
      month: this.month,
      chatId,
    });

    const me = await this.bot.telegram.getMe();
    const configurationRepository = Database.getRepository(Configuration);
    const configuration = await configurationRepository.findOne({
      where: {
        enabled: true,
        name: this.name,
        botName: me.username,
        chatId,
      }
    });
    const users = configuration?.settings?.users || [];

    return calculateScoreByUsers(activities, users);
  }

  private async getChatMember(chatId: number, userId: number) {
    try {
      return await this.bot.telegram.getChatMember(chatId, userId);
    } catch (err) {}

    return {
      user: {
        userId,
        chatId,
        username: null,
        first_name: `User #${userId}`
      }
    }
  }

  private async formatScoreMessage(chatId: number): Promise<string> {
    const scores = await this.buildScoreTable(null, chatId);
    const members = [];

    for (const [index, score] of scores.entries()) {
      const member = await this.getChatMember(chatId, score.userId);
      const place = `${index + 1}.`;
      const name = member.user.first_name;
      const username = member.user.username ? `(${member.user.username})` : ``;

      members.push(`${place} ${name} ${username} → ${score.weightedScore} (b: ${score.baseScore}) [q: ${score.difference}%]`);
    }

    return members.join('\n');
  }

  private async decreaseActivityScore() {
    const me = await this.bot.telegram.getMe();
    const configurationRepository = Database.getRepository(Configuration);
    const configurations = await configurationRepository.findBy({
      enabled: true,
      name: this.name,
      botName: me.username,
    });

    for (const configuration of configurations) {
      const users = configuration.settings?.users || [];
      for (const userId of users) {
        await this.createMemberAction(configuration.chatId, userId, Actions.DECREASE_ACTIVITY, []);
      }
    }
  }

  @checkAdmin({ errorMessage: FORBIDDEN_MESSAGE })
  private async replyWithScore(ctx: Context, targetChatId?: number) {
    const chatId = targetChatId || getChatId(ctx);
    const scoreMessage = await this.formatScoreMessage(chatId);

    await replyTo(ctx, scoreMessage);
  }

  @checkAdmin({ errorMessage: FORBIDDEN_MESSAGE })
  private async replyAndToggleGameState(ctx: Context, active: boolean) {
    await this.saveSettings(ctx, { active });
    await replyTo(ctx, active ? 'В этом чате игра запущена': 'В этом чате игра приостановлена');
  }
}
