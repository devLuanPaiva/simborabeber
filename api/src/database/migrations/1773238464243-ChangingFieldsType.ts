import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangingFieldsType1773238464243 implements MigrationInterface {
    name = 'ChangingFieldsType1773238464243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_f0eb5e5e65c25caed80f642b99e"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "closed_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "closed_at" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "waiter_closed_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_f0eb5e5e65c25caed80f642b99e" FOREIGN KEY ("waiter_closed_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_f0eb5e5e65c25caed80f642b99e"`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "waiter_closed_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "closed_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tabs" ALTER COLUMN "closed_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_f0eb5e5e65c25caed80f642b99e" FOREIGN KEY ("waiter_closed_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
