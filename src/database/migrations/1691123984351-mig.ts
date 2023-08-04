import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1691123984351 implements MigrationInterface {
    name = 'Mig1691123984351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."admins" ADD "apiKey" character varying`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."admins" DROP COLUMN "apiKey"`)
    }
}
