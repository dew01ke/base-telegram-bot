import { Context } from 'telegraf';
// @ts-ignore
import { MessageUpdate } from 'typegram/update';

export function parseMentionCommand(ctx: Context<MessageUpdate>) {
  const message = ctx?.update?.message?.text || '';
  const botName = ctx?.botInfo?.username;
  const [mention] = ctx?.update?.message?.entities?.filter(entity => entity.type === 'mention' && entity.offset === 0) || [];

  if (mention) {
    const mentionName = message.substring(mention.offset, mention.length);

    if (mentionName === `@${botName}`) {
      const [, command, ...payload] = message.split(' ');

      return {
        command,
        payload,
      }
    }
  }

  return {
    command: null
  };
}

export function getUserId(ctx: Context<MessageUpdate>): number {
  return ctx?.message?.from?.id || ctx?.update?.callback_query?.from?.id;
}

export function getChatId(ctx: Context<MessageUpdate>): number {
  return ctx?.chat?.id;
}

export function replyTo(ctx: Context<MessageUpdate>, message: string): Promise<any> {
  if (ctx?.message?.message_id) {
    return ctx.reply(message, { reply_to_message_id: ctx?.message?.message_id });
  } else {
    return ctx.reply(message);
  }
}
