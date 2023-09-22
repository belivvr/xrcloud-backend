import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1695282091685 implements MigrationInterface {
    name = 'Mig1695282091685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ADD "returnUrl" character varying`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "returnUrl"`)
    }
}
