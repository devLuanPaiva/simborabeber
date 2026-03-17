import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewProductCategory1773658075845 implements MigrationInterface {
    name = 'AddNewProductCategory1773658075845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."products_category_enum" RENAME TO "products_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."products_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer')`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "category" TYPE "public"."products_category_enum" USING "category"::"text"::"public"."products_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."products_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."products_category_enum_old" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other')`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "category" TYPE "public"."products_category_enum_old" USING "category"::"text"::"public"."products_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."products_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."products_category_enum_old" RENAME TO "products_category_enum"`);
    }

}
