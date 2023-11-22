import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700679810051 implements MigrationInterface {
    name = 'Mig1700679810051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."rooms" ADD "tag" character varying NOT NULL DEFAULT 'tag'`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "tag"`)
    }
}
