import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1694015266083 implements MigrationInterface {
    name = 'Mig1694015266083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "main"."order_account" ("id" SERIAL NOT NULL, "accountId" integer NOT NULL, "accountCode" character varying NOT NULL, "adminId" character varying NOT NULL, CONSTRAINT "PK_c58ad1d9aad5f910d64f2268e68" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "main"."subs_payment" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'created', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "adminId" character varying NOT NULL, "subsTierId" integer NOT NULL, CONSTRAINT "PK_5663fc277d06ac9c665121e98c5" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "main"."subs_tier" ("id" SERIAL NOT NULL, "productCode" character varying NOT NULL, "priceCode" character varying NOT NULL, "name" character varying NOT NULL, "currency" character varying NOT NULL, "price" character varying NOT NULL, CONSTRAINT "PK_1d56b81b2c9361343e0091a6abc" PRIMARY KEY ("id"))`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."subs_tier"`)
        await queryRunner.query(`DROP TABLE "main"."subs_payment"`)
        await queryRunner.query(`DROP TABLE "main"."order_account"`)
    }
}
