import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductVariantsTable1789300000000 implements MigrationInterface {
    name = 'CreateProductVariantsTable1789300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_variants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying(20) NOT NULL, "price" numeric(10,2) NOT NULL, "sort_order" integer NOT NULL DEFAULT 0, "max_flavors" integer NOT NULL DEFAULT 1, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, CONSTRAINT "PK_2b3a1e6f2b0e5a4d90b2a9d7c31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_7c2e1f8a9d3b4c5e6f7a8b9c0d1" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_7c2e1f8a9d3b4c5e6f7a8b9c0d1"`);
        await queryRunner.query(`DROP TABLE "product_variants"`);
    }

}
