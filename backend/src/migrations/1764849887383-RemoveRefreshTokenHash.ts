import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRefreshTokenHash1764849887383 implements MigrationInterface {
    name = 'RemoveRefreshTokenHash1764849887383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "birthOfDay" date, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
