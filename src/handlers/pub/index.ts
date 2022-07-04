import { BaseHandler } from '@/infrastructure/base/BaseHandler';
import { getChatId, getUserId, handleCommand, replyTo } from '@/utils/telegram';
import { Context } from '@/infrastructure/interfaces/Context';
import { Database } from '@/infrastructure/database';
import { Pub } from '@/handlers/pub/entities/Pub';

const MESSAGES = {
  SUCCESS_ADD: 'Бар добавлен',
  EMPTY_LIST: 'Список баров пуст. Добавьте бар.',
  PUB_RESULT: 'Бар выбран: **{pub}**',
};

export class PubGo extends BaseHandler {
  public name: string = 'pub-go';

  async handleMention(ctx: Context, message: string) {
    handleCommand(message, /^(добавь бар)/i, async (...payload) => {
      const name = payload.join(' ').trim();
      if (name) {
        await this.addPub(ctx, name);
      }
    });

    handleCommand(message, /^(выбери бар)/i, async () => {
      await this.pickPub(ctx);
    });

    handleCommand(message, /^(список баров)/i, async () => {
      await this.pubList(ctx);
    });
  }

  async addPub(ctx: Context, name: string) {
    const pubRepository = Database.getRepository(Pub);

    const pub = new Pub();
    pub.chatId = getChatId(ctx);
    pub.addedBy = getUserId(ctx);
    pub.name = name;
    pub.count = 0;

    await pubRepository.insert(pub);
    await replyTo(ctx, MESSAGES.SUCCESS_ADD);
  }

  async pickPub(ctx: Context) {
    const pubRepository = Database.getRepository(Pub);
    const pub = await pubRepository.findOne({
      where: {
        chatId: getChatId(ctx),
      },
      order: {
        count: 'ASC',
        lastPickedDate: 'ASC'
      },
    });

    if (pub) {
      pub.count = pub.count + 1;
      pub.lastPickedDate = new Date();

      await pubRepository.update({
        id: pub.id,
      }, pub);
    }

    await this.replyWithPub(ctx, pub);
  }

  async pubList(ctx: Context) {
    const pubRepository = Database.getRepository(Pub);
    const pubs = await pubRepository.find({
      where: {
        chatId: getChatId(ctx),
      },
      order: {
        count: 'DESC',
      },
    });

    await this.replyWithPubs(ctx, pubs);
  }

  async replyWithPub(ctx: Context, pub: Pub) {
    await replyTo(ctx, MESSAGES.PUB_RESULT.replace('{pub}', pub.name));
  }

  async replyWithPubs(ctx: Context, pubs: Pub[]) {
    if (pubs.length === 0) {
      return await replyTo(ctx, MESSAGES.EMPTY_LIST);
    }

    const message = pubs.map((pub, index) => {
      return `${index + 1}. ${pub.name}`;
    });

    await replyTo(ctx, message.join('\n'));
  }
}
