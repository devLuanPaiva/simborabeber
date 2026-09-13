import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderItemComponentsAndAddonsTables1789300300000 implements MigrationInterface {
    name = 'CreateOrderItemComponentsAndAddonsTables1789300300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_item_components" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_name" character varying(120) NOT NULL, "variant_label" character varying(20), "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_item_id" uuid NOT NULL, "product_id" uuid, CONSTRAINT "PK_1e2f3a4b5c6d7e8f9a0b1c2d3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_item_components" ADD CONSTRAINT "FK_5f6a7b8c9d0e1f2a3b4c5d6e7f8" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_components" ADD CONSTRAINT "FK_9a0b1c2d3e4f5a6b7c8d9e0f1a2" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE "order_item_addons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "price" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_item_id" uuid NOT NULL, "addon_id" uuid, CONSTRAINT "PK_3b4c5d6e7f8a9b0c1d2e3f4a5b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_item_addons" ADD CONSTRAINT "FK_7c8d9e0f1a2b3c4d5e6f7a8b9c0" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_addons" ADD CONSTRAINT "FK_2d3e4f5a6b7c8d9e0f1a2b3c4d5" FOREIGN KEY ("addon_id") REFERENCES "product_addons"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_addons" DROP CONSTRAINT "FK_2d3e4f5a6b7c8d9e0f1a2b3c4d5"`);
        await queryRunner.query(`ALTER TABLE "order_item_addons" DROP CONSTRAINT "FK_7c8d9e0f1a2b3c4d5e6f7a8b9c0"`);
        await queryRunner.query(`DROP TABLE "order_item_addons"`);

        await queryRunner.query(`ALTER TABLE "order_item_components" DROP CONSTRAINT "FK_9a0b1c2d3e4f5a6b7c8d9e0f1a2"`);
        await queryRunner.query(`ALTER TABLE "order_item_components" DROP CONSTRAINT "FK_5f6a7b8c9d0e1f2a3b4c5d6e7f8"`);
        await queryRunner.query(`DROP TABLE "order_item_components"`);
    }

}
