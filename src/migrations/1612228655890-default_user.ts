import { hash_sha256 } from 'src/crypto/crypto.helper';
import { EUserRole } from 'src/user/user.interface';
import { MigrationInterface, QueryRunner } from 'typeorm';

const email = 'admin@penprop.com';
const password = hash_sha256('youshouldchangeme');
const role = EUserRole.ADMIN;

export class defaultUser1612228655890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO user_entity (email, password, role) VALUES ('${email}','${password}', '${role}')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user_entity WHERE email = '${email}'`);
  }
}
