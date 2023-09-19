import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1695003851851 implements MigrationInterface {
    name = 'Mig1695003851851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "size" DROP DEFAULT`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "size" SET DEFAULT '10'`)
    }
}
