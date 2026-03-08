import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastLoginToUsers1772989756406 implements MigrationInterface {
    name = 'AddLastLoginToUsers1772989756406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login"`);
    }

}
