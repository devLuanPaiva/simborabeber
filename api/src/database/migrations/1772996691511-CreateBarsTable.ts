import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBarsTable1772996691511 implements MigrationInterface {
    name = 'CreateBarsTable1772996691511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bars_access_plan_enum" AS ENUM('basic', 'medium', 'premium')`);
        await queryRunner.query(`CREATE TABLE "bars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "slug" character varying(120) NOT NULL, "image" character varying(255), "access_plan" "public"."bars_access_plan_enum" NOT NULL DEFAULT 'basic', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_52cd80822057748a49d972fd57f" UNIQUE ("slug"), CONSTRAINT "PK_95d898c644f8392ee31217c14da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bar_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c85ab9a745d23eb8c9649d3c09f" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c85ab9a745d23eb8c9649d3c09f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bar_id"`);
        await queryRunner.query(`DROP TABLE "bars"`);
        await queryRunner.query(`DROP TYPE "public"."bars_access_plan_enum"`);
    }

}
