import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeliveryCitiesTable1789300700000 implements MigrationInterface {
    name = 'CreateDeliveryCitiesTable1789300700000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "delivery_cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "fee" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "bar_id" uuid NOT NULL, CONSTRAINT "PK_c68a052e26e32bfc9daf8d0da4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "delivery_cities" ADD CONSTRAINT "FK_5e1a6d3b9c2e4f7a8b1c2d3e4f5" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery_cities" DROP CONSTRAINT "FK_5e1a6d3b9c2e4f7a8b1c2d3e4f5"`);
        await queryRunner.query(`DROP TABLE "delivery_cities"`);
    }

}
