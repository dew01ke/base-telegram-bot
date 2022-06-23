import { Context } from 'telegraf';
import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { calculateScore } from '@/handlers/scoring/utils/calculateScore';
import { checkAdmin } from '@/infrastructure/decorators/checkAdmin';
import { parseMentionCommand } from '@/utils/telegram';
import { getUserId } from '@/utils/telegram';

export class ScoringHandler extends BaseHandler {
  public name: string = 'scoring';
  private state: object = {};

  async handleMessage(ctx: Context) {
    const { command, payload } = parseMentionCommand(ctx);

    switch (command) {
      case 'stats': {
        await this.showStatistics(ctx);

        break;
      }

      default: {
        await this.calculateMessage(ctx);
      }
    }
  }

  async handleCommonEvent(ctx: Context) {
    await this.calculateMessage(ctx);
  }

  async calculateMessage(ctx: Context) {
    const userId = getUserId(ctx);

    if (!this.state[userId]) {
      this.state[userId] = 0;
    }

    this.state[userId] += calculateScore(ctx);
  }

  @checkAdmin
  async showStatistics(ctx: Context) {
    await ctx.reply(JSON.stringify(this.state));
  }
}
