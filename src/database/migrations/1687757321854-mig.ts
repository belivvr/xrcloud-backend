import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1687757321854 implements MigrationInterface {
    name = 'Mig1687757321854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`SET search_path TO main, public`)
        await queryRunner.query(
            `CREATE TABLE "main"."admins" ("id" uuid NOT NULL DEFAULT main.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "main"."projects" ("id" uuid NOT NULL DEFAULT main.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "name" character varying NOT NULL, "projectKey" character varying, "adminId" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `ALTER TABLE "main"."projects" ADD CONSTRAINT "FK_4ab2b883b5ebe93a64dce28ee08" FOREIGN KEY ("adminId") REFERENCES "main"."admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."projects" DROP CONSTRAINT "FK_4ab2b883b5ebe93a64dce28ee08"`
        )
        await queryRunner.query(`DROP TABLE "main"."projects"`)
        await queryRunner.query(`DROP TABLE "main"."admins"`)
        await queryRunner.query(`SET search_path TO public`)
    }
}
