import { MigrationInterface, QueryRunner } from "typeorm";

export class passwordLengthAtt1672953597660 implements MigrationInterface {
    name = 'passwordLengthAtt1672953597660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(30) NOT NULL`);
    }

}
