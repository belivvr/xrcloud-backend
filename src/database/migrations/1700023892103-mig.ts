import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700023892103 implements MigrationInterface {
    name = 'Mig1700023892103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "main"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "projectId" character varying NOT NULL, "infraUserId" character varying NOT NULL, "reticulumId" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."users"`)
    }
}
