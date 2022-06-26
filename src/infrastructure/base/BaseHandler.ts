import { COMMON_EVENT_NAME, EventEmitter, Events } from '@/utils/events';
import { log } from '@/utils/logger';
import { parseMentionCommand } from '@/utils/telegram';
import { Context } from '@/infrastructure/interfaces/Context';
import { Configuration } from '@/infrastructure/entities/Configuration';
import { ObjectLiteral } from '@/infrastructure/interfaces/ObjectLiteral';

export interface Handler {
  handleCommand?(ctx: Context, name: string, payload: string[]): void;
  handleMessage?(ctx: Context): void;
  handleInlineQuery?(ctx: Context): void;
  handleCallbackQuery?(ctx: Context, actionName: string): void;
  handleCommonEvent?(ctx: Context): void;
}

export class BaseHandler implements Handler {
  public name: string;

  constructor(
    private readonly events: EventEmitter,
  ) {
    events.subscribe(Events.MESSAGE, (ctx: Context) => {
      if (this.isActive(ctx)) {
        const { command, payload } = parseMentionCommand(ctx);

        if (command) {
          this.handleCommand(ctx, command, payload);
        } else {
          this.handleMessage(ctx);
        }
      }
    });

    events.subscribe(Events.INLINE_QUERY, (ctx: Context) => {
      if (this.isActive(ctx)) {
        this.handleInlineQuery(ctx);
      }
    });

    events.subscribe(Events.CALLBACK_QUERY, (ctx: Context) => {
      if (this.isActive(ctx)) {
        this.handleCallbackQuery(ctx, ctx.callbackQuery['data']);
      }
    });

    events.subscribe(COMMON_EVENT_NAME, (ctx: Context) => {
      if (this.isActive(ctx)) {
        this.handleCommonEvent(ctx);
      }
    });
  }

  private getConfig(ctx: Context): Configuration {
    return ctx?.configurations?.[this.name] || {};
  }

  private isActive(ctx: Context): boolean {
    return this.getConfig(ctx).enabled;
  }

  private isAdmin(ctx: Context, userId: number): boolean {
    return this.getConfig(ctx).admins?.includes(userId);
  }

  getSettingsFromContext(ctx: Context): ObjectLiteral<any> {
    return this.getConfig(ctx).settings || {};
  }

  handleCommand(ctx: Context, name: string, payload: string[]) {
    log(`Default command handler -> from ${ctx.from.id} [${ctx.chat.id}]`);
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
}
