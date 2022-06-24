import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from '@/infrastructure/database/strategies/snake-naming.strategy';
import { Score } from '@/handlers/squid-game/entities/Score';
import config from '@/infrastructure/config';

export const Database = new DataSource({
  ssl: true,
  type: "postgres",
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  synchronize: true,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    Score
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