import { MigrationInterface, QueryRunner } from 'typeorm';

export class FarmersAndCommission1720000000000 implements MigrationInterface {
  name = 'FarmersAndCommission1720000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "farmers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        "name" varchar(150) NOT NULL,
        "phone" varchar(20),
        "village" varchar(150),
        "district" varchar(100),
        "state" varchar(100),
        "farm_size" varchar(50),
        "crops" text,
        "bio" text,
        "photo_url" varchar,
        "seller_id" uuid NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "FK_farmers_seller" FOREIGN KEY ("seller_id")
          REFERENCES "seller_profiles"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_farmers_seller_id" ON "farmers" ("seller_id")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_farmers_name" ON "farmers" ("name")
    `);

    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "farmer_id" uuid
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "products"
          ADD CONSTRAINT "FK_products_farmer"
          FOREIGN KEY ("farmer_id") REFERENCES "farmers"("id")
          ON DELETE SET NULL;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "seller_profiles"
      ADD COLUMN IF NOT EXISTS "commission_percent" numeric(5,2) NOT NULL DEFAULT 5
    `);

    await queryRunner.query(`
      ALTER TABLE "order_items"
      ADD COLUMN IF NOT EXISTS "farmer_id" uuid,
      ADD COLUMN IF NOT EXISTS "seller_id" uuid,
      ADD COLUMN IF NOT EXISTS "commission_percent" numeric(5,2) NOT NULL DEFAULT 5,
      ADD COLUMN IF NOT EXISTS "student_commission_amount" numeric(12,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "farmer_amount" numeric(12,2) NOT NULL DEFAULT 0
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order_items"
      DROP COLUMN IF EXISTS "farmer_amount",
      DROP COLUMN IF EXISTS "student_commission_amount",
      DROP COLUMN IF EXISTS "commission_percent",
      DROP COLUMN IF EXISTS "seller_id",
      DROP COLUMN IF EXISTS "farmer_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "seller_profiles"
      DROP COLUMN IF EXISTS "commission_percent"
    `);

    await queryRunner.query(`
      ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_products_farmer"
    `);
    await queryRunner.query(`
      ALTER TABLE "products" DROP COLUMN IF EXISTS "farmer_id"
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "farmers"`);
  }
}
