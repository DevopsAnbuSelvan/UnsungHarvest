/**
 * Marks InitialSchema as applied when the DB already has tables
 * (e.g. from prior synchronize) but the migrations table is empty or incomplete.
 *
 * Usage: npm run migration:baseline
 */
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const MIGRATION_NAME = 'InitialSchema1700000000000';
const MIGRATION_TIMESTAMP = 1700000000000;

async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl:
      process.env.DATABASE_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
  });

  await dataSource.initialize();

  const hasUsers = await dataSource
    .query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'users'
      ) AS exists`,
    )
    .then((rows: { exists: boolean }[]) => rows[0]?.exists);

  if (!hasUsers) {
    console.log(
      'No users table found. Run npm run migration:run to create the schema.',
    );
    await dataSource.destroy();
    return;
  }

  const existing = await dataSource.query(
    `SELECT id FROM migrations WHERE name = $1`,
    [MIGRATION_NAME],
  );

  if (existing.length > 0) {
    console.log(`Migration "${MIGRATION_NAME}" is already recorded. Nothing to do.`);
    await dataSource.destroy();
    return;
  }

  await dataSource.query(
    `INSERT INTO migrations (timestamp, name) VALUES ($1, $2)`,
    [MIGRATION_TIMESTAMP, MIGRATION_NAME],
  );

  console.log(`Recorded baseline migration "${MIGRATION_NAME}".`);
  await dataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
