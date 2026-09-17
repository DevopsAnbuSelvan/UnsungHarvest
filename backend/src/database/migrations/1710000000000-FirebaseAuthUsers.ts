import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirebaseAuthUsers1710000000000 implements MigrationInterface {
  name = 'FirebaseAuthUsers1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsers = await queryRunner.hasTable('users');
    if (!hasUsers) return;

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "firebase_uid" varchar(128)
    `);

    // Keep existing Neon rows; they must re-auth via Firebase and can be relinked later.
    await queryRunner.query(`
      UPDATE "users"
      SET "firebase_uid" = 'legacy-' || "id"::text
      WHERE "firebase_uid" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "firebase_uid" SET NOT NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_firebase_uid"
      ON "users" ("firebase_uid")
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "password",
      DROP COLUMN IF EXISTS "email_verification_token",
      DROP COLUMN IF EXISTS "password_reset_token",
      DROP COLUMN IF EXISTS "password_reset_expires",
      DROP COLUMN IF EXISTS "refresh_token_hash"
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "status" SET DEFAULT 'active'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const hasUsers = await queryRunner.hasTable('users');
    if (!hasUsers) return;

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "password" varchar NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS "email_verification_token" varchar,
      ADD COLUMN IF NOT EXISTS "password_reset_token" varchar,
      ADD COLUMN IF NOT EXISTS "password_reset_expires" timestamptz,
      ADD COLUMN IF NOT EXISTS "refresh_token_hash" varchar
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_firebase_uid"`);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN IF EXISTS "firebase_uid"
    `);
  }
}
