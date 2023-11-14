import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1699962579968 implements MigrationInterface {
    name = 'Mig1699962579968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "main"."room_access" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "roomId" character varying NOT NULL, "infraUserId" character varying NOT NULL, "sessionId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_8120c22097d247ea41f4f0df7d5" PRIMARY KEY ("id"))`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."room_access"`)
    }
}
