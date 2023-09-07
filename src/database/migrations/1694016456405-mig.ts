import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1694016456405 implements MigrationInterface {
    name = 'Mig1694016456405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."subs_payment" ADD "orderCode" character varying NOT NULL`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."subs_payment" DROP COLUMN "orderCode"`)
    }
}
