import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1691050755972 implements MigrationInterface {
    name = 'Mig1691050755972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ADD "slug" character varying NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "slug"`)
    }
}
