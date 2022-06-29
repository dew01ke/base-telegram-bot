import { getUserId, replyTo } from '@/utils/telegram';
import { log } from '@/utils/logger';

interface CheckAdminOptions {
  errorMessage?: string;
}

export const checkAdmin = (options?: CheckAdminOptions) => (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const { errorMessage } = options;
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
