import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1689745093072 implements MigrationInterface {
    name = 'Mig1689745093072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ADD "projectId" character varying NOT NULL`)
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "size" SET DEFAULT '10'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "size" SET DEFAULT '24'`)
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "projectId"`)
    }
}
