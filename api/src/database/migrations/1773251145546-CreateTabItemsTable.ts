import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTabItemsTable1773251145546 implements MigrationInterface {
    name = 'CreateTabItemsTable1773251145546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tab_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tab_id" uuid NOT NULL, "waiter_added_id" uuid NOT NULL, CONSTRAINT "PK_d1fd0b3fcfc8422048100b2fa41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tab_items" ADD CONSTRAINT "FK_b27eb89de8478cc24ca99ad37bd" FOREIGN KEY ("tab_id") REFERENCES "tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tab_items" ADD CONSTRAINT "FK_4f0c1755490f134cbcf416e4acd" FOREIGN KEY ("waiter_added_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tab_items" DROP CONSTRAINT "FK_4f0c1755490f134cbcf416e4acd"`);
        await queryRunner.query(`ALTER TABLE "tab_items" DROP CONSTRAINT "FK_b27eb89de8478cc24ca99ad37bd"`);
        await queryRunner.query(`DROP TABLE "tab_items"`);
    }

}
