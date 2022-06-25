import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from '@/infrastructure/database/strategies/snake-naming.strategy';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import config from '@/infrastructure/config';

export const Database = new DataSource({
  ssl: true,
  type: 'postgres',
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    Activity
  ],
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

Database.initialize()
  .catch((error) => {
    console.log(error);
  });