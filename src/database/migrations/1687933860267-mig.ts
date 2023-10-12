import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1687933860267 implements MigrationInterface {
    name = 'Mig1687933860267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "main"."projects" DROP CONSTRAINT "FK_4ab2b883b5ebe93a64dce28ee08"`
        )
        await queryRunner.query(
            `CREATE TABLE "main"."users" ("id" uuid NOT NULL DEFAULT main.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "personalId" character varying NOT NULL, "infraUserId" character varying NOT NULL, "projectId" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "main"."scenes" ("id" uuid NOT NULL DEFAULT main.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "name" character varying NOT NULL, "infraSceneId" character varying NOT NULL, "infraProjectId" character varying NOT NULL, "thumbnailId" character varying NOT NULL, "projectId" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_071fd0f410cbb449feebafd46ac" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(`ALTER TABLE "main"."projects" DROP COLUMN "adminId"`)
        await queryRunner.query(`ALTER TABLE "main"."projects" ADD "adminId" character varying NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."projects" DROP COLUMN "adminId"`)
        await queryRunner.query(`ALTER TABLE "main"."projects" ADD "adminId" uuid`)
        await queryRunner.query(`DROP TABLE "main"."scenes"`)
        await queryRunner.query(`DROP TABLE "main"."users"`)
        await queryRunner.query(
            `ALTER TABLE "main"."projects" ADD CONSTRAINT "FK_4ab2b883b5ebe93a64dce28ee08" FOREIGN KEY ("adminId") REFERENCES "main"."admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        )
    }
}
