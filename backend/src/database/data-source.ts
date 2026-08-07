import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as entities from './entities';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: Object.values(entities),
  migrations: ['src/database/migrations/*.ts'],
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
