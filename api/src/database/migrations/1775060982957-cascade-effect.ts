import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeEffect1775060982957 implements MigrationInterface {
    name = 'CascadeEffect1775060982957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tab_items" DROP CONSTRAINT "FK_b27eb89de8478cc24ca99ad37bd"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea16b76a794642608df684ac293"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_1d1d7583dbedd78efc7f52e88a9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c85ab9a745d23eb8c9649d3c09f"`);
        await queryRunner.query(`ALTER TABLE "bars" ADD "owner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "tab_items" ADD CONSTRAINT "FK_b27eb89de8478cc24ca99ad37bd" FOREIGN KEY ("tab_id") REFERENCES "tabs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea16b76a794642608df684ac293" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bars" ADD CONSTRAINT "FK_a7b8ad3b20ea63ad506106b2429" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_1d1d7583dbedd78efc7f52e88a9" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c85ab9a745d23eb8c9649d3c09f" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c85ab9a745d23eb8c9649d3c09f"`);
        await queryRunner.query(`ALTER TABLE "tabs" DROP CONSTRAINT "FK_1d1d7583dbedd78efc7f52e88a9"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP CONSTRAINT "FK_a7b8ad3b20ea63ad506106b2429"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea16b76a794642608df684ac293"`);
        await queryRunner.query(`ALTER TABLE "tab_items" DROP CONSTRAINT "FK_b27eb89de8478cc24ca99ad37bd"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "owner_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c85ab9a745d23eb8c9649d3c09f" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tabs" ADD CONSTRAINT "FK_1d1d7583dbedd78efc7f52e88a9" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea16b76a794642608df684ac293" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tab_items" ADD CONSTRAINT "FK_b27eb89de8478cc24ca99ad37bd" FOREIGN KEY ("tab_id") REFERENCES "tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
