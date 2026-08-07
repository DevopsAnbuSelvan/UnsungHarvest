import { DataSource, MigrationInterface, QueryRunner } from 'typeorm';
import { config } from 'dotenv';
import * as entities from '../entities';

config();

/**
 * Bootstrap schema for empty databases using entity metadata.
 * Skips when tables already exist (e.g. created previously via synchronize).
 */
export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsers = await queryRunner.hasTable('users');
    if (hasUsers) {
      return;
    }

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    const bootstrap = new DataSource({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: Object.values(entities),
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false,
      synchronize: true,
    });

    await bootstrap.initialize();
    await bootstrap.destroy();
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA public CASCADE`);
    await queryRunner.query(`CREATE SCHEMA public`);
    await queryRunner.query(`GRANT ALL ON SCHEMA public TO public`);
  }
}
