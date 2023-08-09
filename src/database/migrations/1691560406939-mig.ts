import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1691560406939 implements MigrationInterface {
    name = 'Mig1691560406939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "ownerId"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ADD "ownerId" character varying NOT NULL`)
    }
}
