import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeliveryCityNameToOrders1789300800000 implements MigrationInterface {
    name = 'AddDeliveryCityNameToOrders1789300800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_city_name" character varying(120)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_city_name"`);
    }

}
