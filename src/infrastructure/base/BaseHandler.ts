import { Context } from 'telegraf';
import { AllowedHandlers } from '@/infrastructure/repository';
import { EventEmitter, Events } from '@/events';
import { log } from '@/utils/logger';

export interface Handler {
  handleMessage?(ctx: Context): void;
  handlerInlineQuery?(ctx: Context): void;
  handleCallbackQuery?(ctx: Context): void;
}

export class BaseHandler implements Handler {
  public name: string;

  private isValidRequest(chatId: number): boolean {
    return this.allowedHandlers[this.name].includes(chatId);
  }

  constructor(
    private readonly events: EventEmitter,
    private readonly allowedHandlers: AllowedHandlers,
  ) {
    events.subscribe(Events.MESSAGE, (ctx: Context) => {
      if (this.isValidRequest(ctx.chat.id)) {
        this.handleMessage(ctx);
      }
    });

    events.subscribe(Events.INLINE_QUERY, (ctx: Context) => {
      if (this.isValidRequest(ctx.chat.id)) {
        this.handlerInlineQuery(ctx);
      }
    });

    events.subscribe(Events.CALLBACK_QUERY, (ctx: Context) => {
      if (this.isValidRequest(ctx.chat.id)) {
        this.handleCallbackQuery(ctx);
      }
    });
  }

  handleMessage(ctx: Context) {
    log(`Handle message from ${ctx.from.id} [${ctx.chat.id}]: ${ctx.message['text']}`);
  }

  handlerInlineQuery(ctx: Context) {
    log(`Handle inline query from ${ctx.from.id} [${ctx.chat.id}]`);
  }

  handleCallbackQuery(ctx: Context) {
    log(`Handle callback query from ${ctx.from.id} [${ctx.chat.id}]`);
  }
}
