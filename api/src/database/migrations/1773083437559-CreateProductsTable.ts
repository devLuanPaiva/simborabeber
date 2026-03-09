import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1773083437559 implements MigrationInterface {
    name = 'CreateProductsTable1773083437559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."products_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "description" character varying(255), "image" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "price" numeric(10,2) NOT NULL, "category" "public"."products_category_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bar_id" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "bars" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea16b76a794642608df684ac293" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea16b76a794642608df684ac293"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_category_enum"`);
    }

}
