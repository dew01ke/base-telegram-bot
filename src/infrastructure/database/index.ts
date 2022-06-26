import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from '@/infrastructure/database/strategies/snake-naming.strategy';
import { Configuration } from '@/infrastructure/entities/Configuration';
import { Activity } from '@/handlers/squid-game/entities/Activity';
import config, { Mode } from '@/infrastructure/config';

export const Database = new DataSource({
  ssl: true,
  type: 'postgres',
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  synchronize: true,
  logging: config.MODE === Mode.DEVELOPMENT,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    Configuration,
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