import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1710920009795 implements MigrationInterface {
    name = 'Mig1710920009795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "main"."room_activity" ("id" SERIAL NOT NULL, "roomId" character varying NOT NULL, "infraUserId" character varying NOT NULL, "logMessage" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_7b4bfa51e53245d9ddca9582792" PRIMARY KEY ("id"))`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."room_activity"`)
    }
}
