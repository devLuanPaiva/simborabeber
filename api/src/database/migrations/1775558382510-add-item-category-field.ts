import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemCategoryField1775558382510 implements MigrationInterface {
    name = 'AddItemCategoryField1775558382510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tab_items_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks')`);
        await queryRunner.query(`ALTER TABLE "tab_items" ADD "category" "public"."tab_items_category_enum" NOT NULL DEFAULT 'other'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tab_items" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."tab_items_category_enum"`);
    }

}
