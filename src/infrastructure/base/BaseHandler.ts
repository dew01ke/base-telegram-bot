import { Context } from 'telegraf';
import { COMMON_EVENT_NAME, EventEmitter, Events } from '@/utils/events';
import { log } from '@/utils/logger';
import { isHandlerActive } from '@/rules';
import { parseMentionCommand } from '@/utils/telegram';

export interface Handler {
  handleCommand?(ctx: Context, name: string, payload: string[]): void;
  handleMessage?(ctx: Context): void;
  handlerInlineQuery?(ctx: Context): void;
  handleCallbackQuery?(ctx: Context, actionName: string): void;
  handleCommonEvent?(ctx: Context): void;
}

export class BaseHandler implements Handler {
  public name: string;

  constructor(
    private readonly events: EventEmitter,
  ) {
    events.subscribe(Events.MESSAGE, (ctx: Context) => {
      if (isHandlerActive(this.name, ctx.chat.type, ctx.chat.id)) {
        const { command, payload } = parseMentionCommand(ctx);

        if (command) {
          this.handleCommand(ctx, command, payload);
        } else {
          this.handleMessage(ctx);
        }
      }
    });

    events.subscribe(Events.INLINE_QUERY, (ctx: Context) => {
      if (isHandlerActive(this.name, ctx.chat.type, ctx.chat.id)) {
        this.handleInlineQuery(ctx);
      }
    });

    events.subscribe(Events.CALLBACK_QUERY, (ctx: Context) => {
      if (isHandlerActive(this.name, ctx.chat.type, ctx.chat.id)) {
        this.handleCallbackQuery(ctx, ctx.callbackQuery['data']);
      }
    });

    events.subscribe(COMMON_EVENT_NAME, (ctx: Context) => {
      if (isHandlerActive(this.name, ctx.chat.type, ctx.chat.id)) {
        this.handleCommonEvent(ctx);
      }
    });
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
