import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1691028245783 implements MigrationInterface {
    name = 'Mig1691028245783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."scenes" DROP COLUMN "ownerId"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."scenes" ADD "ownerId" character varying NOT NULL`)
    }
}
