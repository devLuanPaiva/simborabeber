import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameMaxFlavorsToNumberOfSlices1789300400000 implements MigrationInterface {
    name = 'RenameMaxFlavorsToNumberOfSlices1789300400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME COLUMN "max_flavors" TO "number_of_slices"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME COLUMN "number_of_slices" TO "max_flavors"`);
    }

}
