import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700533905262 implements MigrationInterface {
    name = 'Mig1700533905262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."cnu_event" RENAME COLUMN "userId" TO "creator"`)
        await queryRunner.query(
            `ALTER TABLE "main"."cnu_event" RENAME CONSTRAINT "UQ_d24268039d5cbfdf4b5478c7b7c" TO "UQ_6e7018c2c9c8ae779bbb8687d0c"`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."cnu_event" RENAME CONSTRAINT "UQ_6e7018c2c9c8ae779bbb8687d0c" TO "UQ_d24268039d5cbfdf4b5478c7b7c"`
        )
        await queryRunner.query(`ALTER TABLE "main"."cnu_event" RENAME COLUMN "creator" TO "userId"`)
    }
}
