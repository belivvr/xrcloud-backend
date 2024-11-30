import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1732702517416 implements MigrationInterface {
    name = 'Mig1732702517416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "main"."room_logs" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "roomId" character varying NOT NULL, "sessionId" character varying NOT NULL, "reticulumId" character varying NOT NULL, "logTime" TIMESTAMP NOT NULL DEFAULT now(), "action" character varying, "ip" character varying, "userAgent" character varying, CONSTRAINT "PK_98cfc6f0d23841cb7f1c1aa2cef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main"."scene_logs" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "sceneId" character varying NOT NULL, "sessionId" character varying NOT NULL, "reticulumId" character varying NOT NULL, "logTime" TIMESTAMP NOT NULL DEFAULT now(), "action" character varying, "ip" character varying, "userAgent" character varying, CONSTRAINT "PK_ef1a25c4b37d71c7ea2799bd15b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "main"."admins" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."admins" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."options" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."options" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."projects" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."projects" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."scenes" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."scenes" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."subscriptions" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."subscriptions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."tiers" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."tiers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."users" ALTER COLUMN "id" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "main"."users" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."users" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."tiers" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."tiers" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."subscriptions" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."subscriptions" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."scenes" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."scenes" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."rooms" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."projects" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."projects" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."options" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."options" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "main"."admins" ALTER COLUMN "id" SET DEFAULT main.uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "main"."admins" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "main"."scene_logs"`);
        await queryRunner.query(`DROP TABLE "main"."room_logs"`);
    }

}
