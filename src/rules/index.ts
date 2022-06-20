import config from '@/infrastructure/config';

export enum RuleType {
  DISABLED = 'off',
  ENABLED = 'on',
  ONLY_PERSONAL = 'private',
  ONLY_GROUP = 'group'
}

export interface Rule {
  type: RuleType;
  ids?: number[];
}

export interface Rules {
  [key: string]: Rule;
}

export function isHandlerActive(name: string, type: 'channel' | 'private' | 'group' | 'supergroup', chatId: number): boolean {
  const rule: Rule = config.RULES[name];

  switch (rule?.type) {
    case RuleType.ENABLED: {
      return rule.ids ? rule.ids.includes(chatId) : true;
    }

    case RuleType.ONLY_GROUP:
    case RuleType.ONLY_PERSONAL: {
      if (rule.type !== type) {
        return false;
      }

      return rule.ids ? rule.ids.includes(chatId) : true;
    }
  }

  return false;
}
