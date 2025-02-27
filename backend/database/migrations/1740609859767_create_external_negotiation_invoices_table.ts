import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.negotiation_invoices';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.date('dat_prest').nullable();
      table.float('val_prest').nullable();
      table.date('dat_payment').nullable();
      table.float('val_payment').nullable();
      table.boolean('status').defaultTo(false);
      table.bigInteger('negotiation_of_payment_id').unsigned().nullable();
      table.string('following_status', 255).nullable();
      table.date('dat_breach').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
