import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1694511062893 implements MigrationInterface {
    name = 'Mig1694511062893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."admins" ADD "name" character varying NOT NULL DEFAULT 'name'`
        )
        await queryRunner.query(`ALTER TABLE "main"."admins" ALTER COLUMN "name" DROP DEFAULT`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."admins" DROP COLUMN "name"`)
    }
}
