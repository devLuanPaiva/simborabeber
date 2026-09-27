import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPizzaCategoryToEnums1789300100000 implements MigrationInterface {
    name = 'AddPizzaCategoryToEnums1789300100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."products_category_enum" RENAME TO "products_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."products_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks', 'pizza')`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "category" TYPE "public"."products_category_enum" USING "category"::"text"::"public"."products_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."products_category_enum_old"`);

        await queryRunner.query(`ALTER TYPE "public"."order_items_category_enum" RENAME TO "order_items_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_items_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks', 'pizza')`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "category" TYPE "public"."order_items_category_enum" USING "category"::"text"::"public"."order_items_category_enum"`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "category" SET DEFAULT 'other'`);
        await queryRunner.query(`DROP TYPE "public"."order_items_category_enum_old"`);

        await queryRunner.query(`ALTER TYPE "public"."tab_items_category_enum" RENAME TO "tab_items_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."tab_items_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks', 'pizza')`);
        await queryRunner.query(`ALTER TABLE "tab_items" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tab_items" ALTER COLUMN "category" TYPE "public"."tab_items_category_enum" USING "category"::"text"::"public"."tab_items_category_enum"`);
        await queryRunner.query(`ALTER TABLE "tab_items" ALTER COLUMN "category" SET DEFAULT 'other'`);
        await queryRunner.query(`DROP TYPE "public"."tab_items_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tab_items_category_enum_old" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks')`);
        await queryRunner.query(`ALTER TABLE "tab_items" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tab_items" ALTER COLUMN "category" TYPE "public"."tab_items_category_enum_old" USING "category"::"text"::"public"."tab_items_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tab_items" ALTER COLUMN "category" SET DEFAULT 'other'`);
        await queryRunner.query(`DROP TYPE "public"."tab_items_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."tab_items_category_enum_old" RENAME TO "tab_items_category_enum"`);

        await queryRunner.query(`CREATE TYPE "public"."order_items_category_enum_old" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks')`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "category" TYPE "public"."order_items_category_enum_old" USING "category"::"text"::"public"."order_items_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "category" SET DEFAULT 'other'`);
        await queryRunner.query(`DROP TYPE "public"."order_items_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_items_category_enum_old" RENAME TO "order_items_category_enum"`);

        await queryRunner.query(`CREATE TYPE "public"."products_category_enum_old" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks')`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "category" TYPE "public"."products_category_enum_old" USING "category"::"text"::"public"."products_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."products_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."products_category_enum_old" RENAME TO "products_category_enum"`);
    }

}
