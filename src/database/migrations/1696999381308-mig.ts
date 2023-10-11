import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1696999381308 implements MigrationInterface {
    name = 'Mig1696999381308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "main"."options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "role" character varying NOT NULL, "values" json NOT NULL, "roomId" character varying NOT NULL, CONSTRAINT "PK_d232045bdb5c14d932fba18d957" PRIMARY KEY ("id"))`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."options"`)
    }
}
