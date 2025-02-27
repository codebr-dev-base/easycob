import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.promise_of_payments';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.date('dat_prev').nullable();
      table.float('val_prest').nullable();
      table.date('dat_payment').nullable();
      table.float('val_payment').nullable();
      table.boolean('status').defaultTo(false);
      table.integer('action_id').unsigned().nullable();
      table.float('val_original').nullable();
      table.string('following_status', 255).nullable();
      table.date('dat_breach').nullable();
      table.boolean('discount').defaultTo(false);
      table.float('val_discount').nullable();
      table.integer('perc_discount').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
