import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1694077768925 implements MigrationInterface {
    name = 'Mig1694077768925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."admins" DROP COLUMN "subsTierId"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."admins" ADD "subsTierId" integer NOT NULL`)
    }
}
