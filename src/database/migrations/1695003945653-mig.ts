import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1695003945653 implements MigrationInterface {
    name = 'Mig1695003945653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ADD "isPublic" boolean NOT NULL DEFAULT false`)
        await queryRunner.query(
            `ALTER TABLE "main"."scenes" ADD "isPublicRoomOnCreate" boolean NOT NULL DEFAULT false`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."scenes" DROP COLUMN "isPublicRoomOnCreate"`)
        await queryRunner.query(`ALTER TABLE "main"."rooms" DROP COLUMN "isPublic"`)
    }
}
