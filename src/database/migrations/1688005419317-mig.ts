import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1688005419317 implements MigrationInterface {
    name = 'Mig1688005419317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."scenes" RENAME COLUMN "userId" TO "ownerId"`)
        await queryRunner.query(
            `CREATE TABLE "main"."rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "name" character varying NOT NULL, "infraRoomId" character varying NOT NULL, "size" integer NOT NULL DEFAULT '24', "thumbnailId" character varying NOT NULL, "sceneId" character varying NOT NULL, "ownerId" character varying NOT NULL, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."rooms"`)
        await queryRunner.query(`ALTER TABLE "main"."scenes" RENAME COLUMN "ownerId" TO "userId"`)
    }
}
