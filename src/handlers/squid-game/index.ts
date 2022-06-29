import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { Database } from '@/infrastructure/database';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import { Actions, getAction, getModifications, Modifications } from '@/handlers/squid-game/utils/messageDecomposition';
import { getChatId, getUserId, handleCommand, handleSchedule, replyTo } from '@/utils/telegram';
import { calculateScoreByUsers, MemberScore } from '@/handlers/squid-game/utils/calculateScore';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';
import { Context } from '@/infrastructure/interfaces/Context';
import { Configuration } from '@/infrastructure/entities/Configuration';

const FORBIDDEN_MESSAGE = 'У тебя нет доступа, пёс.';

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

  async handleSchedulerEvent() {
    handleSchedule(20, async () => {
      await this.decreaseActivityScore();
      await this.notifyWithScore();
    });
  }

  async extractMemberAction(ctx: Context) {
    await this.createMemberAction(
      getChatId(ctx),
      getUserId(ctx),
      getAction(ctx),
      getModifications(ctx)
    );
  }

  async createMemberAction(
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

  async buildScoreTable(ctx?: Context, targetChatId?: number): Promise<MemberScore[]> {
    const chatId = targetChatId || getChatId(ctx);
    const activityRepository = Database.getRepository(Activity);
    const activities = await activityRepository.findBy({
      month: this.month,
      chatId,
    });

    return calculateScoreByUsers(activities);
  }

  async formatScoreMessage(chatId: number): Promise<string> {
    const memberScores = await this.buildScoreTable(null, chatId);
    const members = [];

    for (const memberScore of memberScores) {
      const member = await this.bot.telegram.getChatMember(chatId, memberScore.userId);
      const username = member.user.username || member.user.first_name;
      members.push(`${member.user.first_name} (${username}) → ${memberScore.weighedScore} (${memberScore.rawScore})`);
    }

    return members.join('\n');
  }

  async decreaseActivityScore() {
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

  async notifyWithScore() {
    const me = await this.bot.telegram.getMe();
    const configurationRepository = Database.getRepository(Configuration);
    const configurations = await configurationRepository.findBy({
      enabled: true,
      name: this.name,
      botName: me.username,
    });

    for (const configuration of configurations) {
      const scoreMessage = await this.formatScoreMessage(configuration.chatId);
      await this.bot.telegram.sendMessage(configuration.chatId, scoreMessage);
    }
  }

  @checkAdmin(FORBIDDEN_MESSAGE)
  async replyWithScore(ctx: Context, targetChatId?: number) {
    const chatId = targetChatId || getChatId(ctx);
    const scoreMessage = await this.formatScoreMessage(chatId);

    await replyTo(ctx, scoreMessage);
  }

  @checkAdmin(FORBIDDEN_MESSAGE)
  async replyAndToggleGameState(ctx: Context, active: boolean) {
    await this.saveSettings(ctx, { active });
    await replyTo(ctx, active ? 'Игра запущена': 'Игра остановлена');
  }
}
