import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700681712529 implements MigrationInterface {
    name = 'Mig1700681712529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "isPublic"`)
        await queryRunner.query(`ALTER TABLE "main"."scenes" DROP COLUMN "isPublicRoomOnCreate"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."scenes" ADD "isPublicRoomOnCreate" boolean NOT NULL DEFAULT false`
        )
        await queryRunner.query(`ALTER TABLE "main"."rooms" ADD "isPublic" boolean NOT NULL DEFAULT false`)
    }
}
