import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
  protected tableName = 'base_externa.mail_invoices';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.bigInteger('des_contr');
      table.string('contact');
      table.string('messageid').nullable();
      table.string('type').nullable();
      table.integer('user_id').unsigned().references('users.id');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
