import { Telegraf } from 'telegraf';
import { COMMON_EVENT_NAME, EventEmitter, Events, SCHEDULER_EVENT_NAME } from '@/utils/events';
import { Database } from '@/infrastructure/database';
import { log } from '@/utils/logger';
import { getChatId, isMention } from '@/utils/telegram';
import { Context } from '@/infrastructure/interfaces/Context';
import { Configuration } from '@/infrastructure/entities/Configuration';
import { ObjectLiteral } from '@/infrastructure/interfaces/ObjectLiteral';

export interface Handler {
  handleMention?(ctx: Context, message: string): void;
  handleMessage?(ctx: Context): void;
  handleInlineQuery?(ctx: Context): void;
  handleCallbackQuery?(ctx: Context, actionName: string): void;
  handleCommonEvent?(ctx: Context): void;
  handleSchedulerEvent?(): void;
}

export class BaseHandler implements Handler {
  public name: string;

  constructor(
    public readonly bot: Telegraf,
    private readonly events: EventEmitter,
  ) {
    events.subscribe(Events.MESSAGE, (ctx: Context) => {
      if (this.isEnabled(ctx)) {
        const message = isMention(ctx);
        if (message) {
          this.handleMention(ctx, message);
        } else {
          this.handleMessage(ctx);
        }
      }
    });

    events.subscribe(Events.INLINE_QUERY, (ctx: Context) => {
      if (this.isEnabled(ctx)) {
        this.handleInlineQuery(ctx);
      }
    });

    events.subscribe(Events.CALLBACK_QUERY, (ctx: Context) => {
      if (this.isEnabled(ctx)) {
        this.handleCallbackQuery(ctx, ctx.callbackQuery['data']);
      }
    });

    events.subscribe(COMMON_EVENT_NAME, (ctx: Context) => {
      if (this.isEnabled(ctx)) {
        this.handleCommonEvent(ctx);
      }
    });

    events.subscribe(SCHEDULER_EVENT_NAME, () => {
      this.handleSchedulerEvent();
    });
  }

  private getConfig(ctx: Context): Configuration {
    return ctx?.configurations?.[this.name] || {};
  }

  private isEnabled(ctx: Context): boolean {
    return this.getConfig(ctx).enabled;
  }

  private isAdmin(ctx: Context, userId: number): boolean {
    return this.getConfig(ctx).admins?.includes(userId);
  }

  getSettingsFromContext(ctx: Context): ObjectLiteral<any> {
    return this.getConfig(ctx).settings || {};
  }

  async saveSettings(ctx: Context, actualSettings: object): Promise<ObjectLiteral<any>> {
    const settings = this.getConfig(ctx).settings || {};
    const updatedSettings = Object.assign({}, settings, actualSettings);

    const configurationRepository = Database.getRepository(Configuration);
    await configurationRepository.update(
      {
        name: this.name,
        chatId: getChatId(ctx)
      },
      {
        settings: updatedSettings,
      }
    );

    return updatedSettings;
  }

  handleMention(ctx: Context, message: string) {
    log(`Default mention handler -> from ${ctx.from.id} [${ctx.chat.id}]`);
  }

  handleMessage(ctx: Context) {
    log(`Default message handler -> from ${ctx.from.id} [${ctx.chat.id}]: ${ctx.message['text']}`);
  }

  handleInlineQuery(ctx: Context) {
    log(`Default inline query handler -> from ${ctx.from.id} [${ctx.chat.id}]`);
  }

  handleCallbackQuery(ctx: Context, actionName: string) {
    log(`Default callback query handler -> from ${ctx.from.id} [${ctx.chat.id}]`);
  }

  handleCommonEvent(ctx: Context) {
    log(`Default event handler -> from ${ctx.from.id} [${ctx.chat.id}]`);
  }

  handleSchedulerEvent() {
    log(`Default scheduler handler`);
  }
}
