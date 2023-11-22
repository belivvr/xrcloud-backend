import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700679810051 implements MigrationInterface {
    name = 'Mig1700679810051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."rooms" ADD "tags" character varying array NOT NULL DEFAULT '{}'`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "tag"`)
    }
}
