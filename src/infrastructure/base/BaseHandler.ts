import { EventEmitter, Events } from '@/events';
import { Context } from 'telegraf';

export interface Handler {
  handleMessage?(ctx: Context): void;
}

export class BaseHandler implements Handler {
  constructor(
    private readonly events: EventEmitter,
  ) {
    events.subscribe(Events.MESSAGE, (ctx: Context) => {
      this.handleMessage(ctx);
    });
  }

  handleMessage(ctx: Context) {}
}
