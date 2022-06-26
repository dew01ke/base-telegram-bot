import { Context } from '@/infrastructure/interfaces/Context';

export function isMention(ctx: Context) {
  const message = ctx?.update?.message?.text || '';
  const botName = ctx?.botInfo?.username;
  const [mention] = ctx?.update?.message?.entities?.filter(entity => entity.type === 'mention' && entity.offset === 0) || [];

  if (mention) {
    const mentionName = message.substring(mention.offset, mention.length);

    if (mentionName === `@${botName}`) {
      const [, ...payload] = message.split(' ');

      return payload.join(' ');
    }

    return mentionName === `@${botName}`;
  }

  return false;
}

export function handleCommand(message: string, command: RegExp, callback: (...args: string[]) => void) {
  if (command.test(message)) {
    const [,, payload] = message.split(command);
    const args = payload.trim().split(' ');

    callback(...args);
  }
}

export function getUserId(ctx: Context): number {
  return ctx?.message?.from?.id || ctx?.update?.callback_query?.from?.id;
}

export function getChatId(ctx: Context): number {
  return ctx?.chat?.id;
}

export function replyTo(ctx: Context, message: string): Promise<any> {
  if (ctx?.message?.message_id) {
    return ctx.reply(message, { reply_to_message_id: ctx?.message?.message_id });
  } else {
    return ctx.reply(message);
  }
}
