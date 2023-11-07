import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1699335737649 implements MigrationInterface {
    name = 'Mig1699335737649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" ADD "label" character varying`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" DROP COLUMN "label"`)
    }
}
