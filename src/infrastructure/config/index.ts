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
  RULES: safeJsonParse(String(process.env.RULES || {})),

  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10) || 6432,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
}
