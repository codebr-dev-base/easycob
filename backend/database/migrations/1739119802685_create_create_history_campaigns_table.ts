import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'history_campaigns';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('name', 255);
      table.string('num_whatsapp', 255);
      table.date('date');
      table.text('message');
      table.string('file_name', 255);
      table.boolean('single_send').defaultTo(true);
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
      table.enu('type', ['SMS', 'EMAIL']).defaultTo('SMS');
      table.string('email', 255);
      table.string('subject', 255);
      table.integer('template_external_id');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
