import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliverySettingsToBars1789254690658 implements MigrationInterface {
    name = 'AddDeliverySettingsToBars1789254690658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bars" ADD "comandas_enabled" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "bars" ADD "delivery_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "bars" ADD "delivery_fee" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bars" ADD "min_order_value" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bars" ADD "delivery_origin_address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "bars" ADD "opening_hours" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "opening_hours"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "delivery_origin_address"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "min_order_value"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "delivery_fee"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "delivery_enabled"`);
        await queryRunner.query(`ALTER TABLE "bars" DROP COLUMN "comandas_enabled"`);
    }

}
