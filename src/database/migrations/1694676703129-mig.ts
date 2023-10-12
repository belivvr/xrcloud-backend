import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1694676703129 implements MigrationInterface {
    name = 'Mig1694676703129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "main"."subscriptions" ("id" uuid NOT NULL DEFAULT main.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "status" character varying NOT NULL, "startAt" TIMESTAMP NOT NULL, "endAt" TIMESTAMP NOT NULL, "adminId" character varying NOT NULL, "tierId" character varying NOT NULL, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "main"."tiers" ("id" uuid NOT NULL DEFAULT main.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "currency" character varying NOT NULL, "price" character varying NOT NULL, "maxStorage" character varying NOT NULL, "maxRooms" integer NOT NULL, "maxRoomSize" integer NOT NULL, CONSTRAINT "PK_908405492b9b2c2ae1cea1e1cc0" PRIMARY KEY ("id"))`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "main"."tiers"`)
        await queryRunner.query(`DROP TABLE "main"."subscriptions"`)
    }
}
