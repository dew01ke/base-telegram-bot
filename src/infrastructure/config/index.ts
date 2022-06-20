import { safeJsonParse } from '@/utils/json';

export enum Mode {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export default {
  MODE: process.env.NODE_ENV = 'production' ? Mode.PRODUCTION : Mode.DEVELOPMENT,
  FUNCTION_ID: process.env.FUNCTION_ID ,
  BOT_USE_POLLING: process.env.BOT_USE_POLLING === 'true' ?? true,
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_ADMIN: String(process.env.BOT_ADMIN).split(','),
  RULES: safeJsonParse(String(process.env.RULES || {})),
}
