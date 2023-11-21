import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700534872626 implements MigrationInterface {
    name = 'Mig1700534872626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."scenes" ADD "creator" character varying`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."scenes" DROP COLUMN "creator"`)
    }
}
