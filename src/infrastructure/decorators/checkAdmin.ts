import { isAdmin } from '@/rules';
import { getUserId } from '@/utils/telegram';

export function checkAdmin(target: any, key: string, descriptor: PropertyDescriptor) {
  if (!descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(target, key);
  }
  const method = descriptor.value;

  descriptor.value = function (...args) {
    const ctx = args[0];
    const userId = getUserId(ctx);

    if (!isAdmin(this.name, userId)) {
      console.warn('User with id', userId, 'is not admin');

      return null;
    }

    return method.apply(this, args);
  };

  return descriptor;
}