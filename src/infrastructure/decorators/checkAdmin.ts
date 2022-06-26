import { getUserId, replyTo } from '@/utils/telegram';
import { log } from '@/utils/logger';

export function checkAdmin(target: any, key: string, descriptor: PropertyDescriptor) {
  if (!descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(target, key);
  }
  const method = descriptor.value;

  descriptor.value = function (...args) {
    const ctx = args[0];
    const userId = getUserId(ctx);

    if (!this.isAdmin(ctx, userId)) {
      log('User with id', userId, 'is not admin');
      replyTo(ctx, 'У тебя нет прав, пёс.');

      return null;
    }

    return method.apply(this, args);
  };

  return descriptor;
}