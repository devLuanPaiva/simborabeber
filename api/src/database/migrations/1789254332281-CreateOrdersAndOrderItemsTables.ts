import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersAndOrderItemsTables1789254332281 implements MigrationInterface {
    name = 'CreateOrdersAndOrderItemsTables1789254332281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_items_category_enum" AS ENUM('beers', 'drinks', 'snacks', 'non_alcoholic', 'other', 'skewer', 'soft_drinks')`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "notes" character varying(255), "category" "public"."order_items_category_enum" NOT NULL DEFAULT 'other', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" uuid NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_type_enum" AS ENUM('delivery', 'pickup')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('received', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_method_enum" AS ENUM('cash', 'card', 'pix')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_status_enum" AS ENUM('pending', 'paid')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."orders_type_enum" NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'received', "customer_name" character varying(120) NOT NULL, "customer_phone" character varying(20) NOT NULL, "delivery_address" character varying(255), "delivery_fee" numeric(10,2) NOT NULL DEFAULT '0', "payment_method" "public"."orders_payment_method_enum" NOT NULL, "payment_status" "public"."orders_payment_status_enum" NOT NULL DEFAULT 'pending', "notes" character varying(255), "total_value" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ready_at" TIMESTAMP, "completed_at" TIMESTAMP, "cancelled_at" TIMESTAMP, "bar_id" uuid NOT NULL, "attended_by_id" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_d81d6488e9f718409ed09195264" FOREIGN KEY ("bar_id") REFERENCES "bars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_33f0e1ffdb69333ea769f084b44" FOREIGN KEY ("attended_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_33f0e1ffdb69333ea769f084b44"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_d81d6488e9f718409ed09195264"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_type_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TYPE "public"."order_items_category_enum"`);
    }

}
