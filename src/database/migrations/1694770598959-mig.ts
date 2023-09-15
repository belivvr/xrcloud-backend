import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1694770598959 implements MigrationInterface {
    name = 'Mig1694770598959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."tiers" ADD "isDefault" boolean NOT NULL DEFAULT false`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."tiers" DROP COLUMN "isDefault"`)
    }
}
