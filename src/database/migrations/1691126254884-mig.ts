import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1691126254884 implements MigrationInterface {
    name = 'Mig1691126254884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" DROP COLUMN "projectKey"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" ADD "projectKey" character varying`)
    }
}
