import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.external_files';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('file_name');
      table.string('file_path');
      table.integer('new_contract').nullable();
      table.integer('update_contract').nullable();
      table.integer('disable_contract').nullable;
      table.integer('lines').nullable();
      table.float('monetary').nullable();
      table.integer('user_id').unsigned().references('users.id');
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
