import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTabsTable1773161366046 implements MigrationInterface {
    name = 'CreateTabsTable1773161366046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tabs_status_enum" AS ENUM('open', 'closed')`);
        await queryRunner.query(`CREATE TABLE "tabs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."tabs_status_enum" NOT NULL DEFAULT 'open', "table_number" integer, "customer_name" character varying(255), "total_value" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "closed_at" TIMESTAMP NOT NULL DEFAULT now(), "bar_id" uuid, "waiter_open_id" uuid NOT NULL, "waiter_closed_id" uuid NOT NULL, CONSTRAINT "PK_3941e8f644528bfc73a3a16afe4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_1d1d7583dbedd78efc7f52e88a9" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_b676148bd5ee9f80b26d5eb4e6e" FOREIGN KEY ("waiter_open_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_f0eb5e5e65c25caed80f642b99e" FOREIGN KEY ("waiter_closed_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_f0eb5e5e65c25caed80f642b99e"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_b676148bd5ee9f80b26d5eb4e6e"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_1d1d7583dbedd78efc7f52e88a9"`);
        await queryRunner.query(`DROP TABLE "tabs"`);
        await queryRunner.query(`DROP TYPE "public"."tabs_status_enum"`);
    }

}
