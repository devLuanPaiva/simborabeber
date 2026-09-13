import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeProductPriceOptional1789300500000 implements MigrationInterface {
    name = 'MakeProductPriceOptional1789300500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "products" SET "price" = 0 WHERE "price" IS NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" SET NOT NULL`);
    }

}
