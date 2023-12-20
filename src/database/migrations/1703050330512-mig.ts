import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1703050330512 implements MigrationInterface {
    name = 'Mig1703050330512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" ADD "webhookUrl" character varying`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" DROP COLUMN "webhookUrl"`)
    }
}
