import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Must run after AddPizzaCategoryToEnums1789300100000 so this enum is
 * created directly with 'pizza' included, avoiding a follow-up rename.
 */
export class CreateProductAddonsTable1789300200000 implements MigrationInterface {
    name = 'CreateProductAddonsTable1789300200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_addons_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks', 'pizza')`);
        await queryRunner.query(`CREATE TABLE "product_addons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "price" numeric(10,2) NOT NULL, "category" "public"."product_addons_category_enum", "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bar_id" uuid NOT NULL, CONSTRAINT "PK_9d1a2b3c4d5e6f7a8b9c0d1e2f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_addons" ADD CONSTRAINT "FK_4a5b6c7d8e9f0a1b2c3d4e5f6a7" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_addons" DROP CONSTRAINT "FK_4a5b6c7d8e9f0a1b2c3d4e5f6a7"`);
        await queryRunner.query(`DROP TABLE "product_addons"`);
        await queryRunner.query(`DROP TYPE "public"."product_addons_category_enum"`);
    }

}
