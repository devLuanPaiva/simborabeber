import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPizzaSupportToTabItems1789300600000 implements MigrationInterface {
    name = 'AddPizzaSupportToTabItems1789300600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tab_items" ADD "notes" character varying(255)`);

        await queryRunner.query(`CREATE TABLE "tab_item_components" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_name" character varying(120) NOT NULL, "variant_label" character varying(20), "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tab_item_id" uuid NOT NULL, "product_id" uuid, CONSTRAINT "PK_8a1b2c3d4e5f6a7b8c9d0e1f2a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tab_item_components" ADD CONSTRAINT "FK_4b5c6d7e8f9a0b1c2d3e4f5a6b7" FOREIGN KEY ("tab_item_id") REFERENCES "tab_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tab_item_components" ADD CONSTRAINT "FK_8c9d0e1f2a3b4c5d6e7f8a9b0c1" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE "tab_item_addons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tab_item_id" uuid NOT NULL, "addon_id" uuid, CONSTRAINT "PK_2d3e4f5a6b7c8d9e0f1a2b3c4d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tab_item_addons" ADD CONSTRAINT "FK_6e7f8a9b0c1d2e3f4a5b6c7d8e9" FOREIGN KEY ("tab_item_id") REFERENCES "tab_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tab_item_addons" ADD CONSTRAINT "FK_0f1a2b3c4d5e6f7a8b9c0d1e2f3" FOREIGN KEY ("addon_id") REFERENCES "product_addons"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tab_item_addons" DROP CONSTRAINT "FK_0f1a2b3c4d5e6f7a8b9c0d1e2f3"`);
        await queryRunner.query(`ALTER TABLE "tab_item_addons" DROP CONSTRAINT "FK_6e7f8a9b0c1d2e3f4a5b6c7d8e9"`);
        await queryRunner.query(`DROP TABLE "tab_item_addons"`);

        await queryRunner.query(`ALTER TABLE "tab_item_components" DROP CONSTRAINT "FK_8c9d0e1f2a3b4c5d6e7f8a9b0c1"`);
        await queryRunner.query(`ALTER TABLE "tab_item_components" DROP CONSTRAINT "FK_4b5c6d7e8f9a0b1c2d3e4f5a6b7"`);
        await queryRunner.query(`DROP TABLE "tab_item_components"`);

        await queryRunner.query(`ALTER TABLE "tab_items" DROP COLUMN "notes"`);
    }

}
