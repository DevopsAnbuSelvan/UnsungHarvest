import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds `admin` to the users.role postgres enum (separate from super_cold_admin).
 */
export class AddAdminRole1730000000000 implements MigrationInterface {
  name = 'AddAdminRole1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_enum e
          JOIN pg_type t ON e.enumtypid = t.oid
          WHERE t.typname = 'users_role_enum'
            AND e.enumlabel = 'admin'
        ) THEN
          ALTER TYPE users_role_enum ADD VALUE 'admin';
        END IF;
      END
      $$;
    `);
  }

  public async down(): Promise<void> {
    // Postgres cannot easily remove enum values; leave as no-op.
  }
}
