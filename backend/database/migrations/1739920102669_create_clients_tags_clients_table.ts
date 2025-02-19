import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'clients_tags_users';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.bigInteger('cod_credor_des_regis');
      table.integer('tag_id');
      table.integer('user_id');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
