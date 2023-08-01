import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1688633058918 implements MigrationInterface {
    name = 'Mig1688633058918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" ADD "faviconId" character varying NOT NULL`)
        await queryRunner.query(`ALTER TABLE "main"."projects" ADD "logoId" character varying NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" DROP COLUMN "logoId"`)
        await queryRunner.query(`ALTER TABLE "main"."projects" DROP COLUMN "faviconId"`)
    }
}
