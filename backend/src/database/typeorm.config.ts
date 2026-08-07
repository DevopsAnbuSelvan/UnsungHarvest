import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as entities from './entities';

export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.name'),
  entities: Object.values(entities),
  ssl: configService.get<boolean>('database.ssl')
    ? { rejectUnauthorized: false }
    : false,
  synchronize: false,
  logging: configService.get<string>('app.nodeEnv') === 'development',
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: false,
});
