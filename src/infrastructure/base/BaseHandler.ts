import { Context } from 'telegraf';
import { EventEmitter, Events } from '@/utils/events';
import { log } from '@/utils/logger';
import { isHandlerActive } from '@/rules';

export interface Handler {
  handleMessage?(ctx: Context): void;
  handlerInlineQuery?(ctx: Context): void;
  handleCallbackQuery?(ctx: Context, actionName: string): void;
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
        this.handlerInlineQuery(ctx);
      }
    });

    events.subscribe(Events.CALLBACK_QUERY, (ctx: Context) => {
      if (isHandlerActive(this.name, ctx.chat.type, ctx.chat.id)) {
        this.handleCallbackQuery(ctx, ctx.callbackQuery['data']);
      }
    });
  }

  handleMessage(ctx: Context) {
    log(`Default message handler -> from ${ctx.from.id} [${ctx.chat.id}]: ${ctx.message['text']}`);
  }

  handlerInlineQuery(ctx: Context) {
    log(`Default inline query handler -> from ${ctx.from.id} [${ctx.chat.id}]`);
  }

  handleCallbackQuery(ctx: Context, actionName: string) {
    log(`Default callback query handler -> from ${ctx.from.id} [${ctx.chat.id}]`);
  }
}
