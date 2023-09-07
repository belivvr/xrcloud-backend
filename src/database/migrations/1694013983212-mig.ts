import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1694013983212 implements MigrationInterface {
    name = 'Mig1694013983212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."admins" ADD "name" character varying NOT NULL DEFAULT 'name'`
        )
        await queryRunner.query(`ALTER TABLE "main"."admins" ALTER COLUMN "name" DROP DEFAULT`)
        await queryRunner.query(`ALTER TABLE "main"."admins" ADD "subsTierId" integer NOT NULL DEFAULT 1`)
        await queryRunner.query(`ALTER TABLE "main"."admins" ALTER COLUMN "subsTierId" DROP DEFAULT`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."admins" DROP COLUMN "subsTierId"`)
        await queryRunner.query(`ALTER TABLE "main"."admins" DROP COLUMN "name"`)
    }
}
