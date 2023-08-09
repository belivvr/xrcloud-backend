import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1691050755972 implements MigrationInterface {
    name = 'Mig1691050755972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ADD "slug" character varying`)
        await queryRunner.query(`UPDATE "main"."rooms" SET "slug" = 'default-value'`)
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "slug" SET NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "slug"`)
    }
}
