import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700644851241 implements MigrationInterface {
    name = 'Mig1700644851241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."cnu_event"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "main"."cnu_event" ("id" uuid NOT NULL DEFAULT main.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "userId" character varying NOT NULL, "projectId" character varying NOT NULL, "sceneId" character varying NOT NULL, "roomId" character varying, CONSTRAINT "UQ_d24268039d5cbfdf4b5478c7b7c" UNIQUE ("userId"), CONSTRAINT "PK_d5fdbe51369903905404dd4d83e" PRIMARY KEY ("id"))`
        )
    }
}
