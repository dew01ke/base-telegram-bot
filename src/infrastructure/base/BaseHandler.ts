import { Context } from 'telegraf';
import { COMMON_EVENT_NAME, EventEmitter, Events } from '@/utils/events';
import { log } from '@/utils/logger';
import { isHandlerActive } from '@/rules';

export interface Handler {
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
        this.handleMessage(ctx);
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
