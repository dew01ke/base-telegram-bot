import { getUserId, replyTo } from '@/utils/telegram';
import { log } from '@/utils/logger';

export const checkAdmin = (errorMessage?: string) => (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args) {
    const ctx = args[0];
    const userId = getUserId(ctx);

    if (!this.isAdmin(ctx, userId)) {
      log('Access denied for', userId);

      if (errorMessage) {
        await replyTo(ctx, errorMessage);
      }

      return null;
    }

    return originalMethod.apply(this, args);
  };

  return descriptor;
};
