import { Context as TelegrafContext } from 'telegraf';
import { ObjectLiteral } from '@/infrastructure/interfaces/ObjectLiteral';
// @ts-ignore
import { MessageUpdate } from 'typegram/update';

export interface Context extends TelegrafContext<MessageUpdate> {
  configurations: ObjectLiteral<any>;
}
