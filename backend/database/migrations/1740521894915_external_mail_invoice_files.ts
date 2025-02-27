import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
  protected tableName = 'base_externa.mail_invoice_files';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('file_name');
      table.integer('mail_invoice_id');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
