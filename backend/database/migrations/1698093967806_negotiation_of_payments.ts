import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
  protected tableName = 'negotiation_of_payments';
  // Registar quebra de acordo
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('id_negotiation').nullable();
      table.float('val_original');
      table.float('val_total_prest');
      table.float('val_entra');
      table.integer('num_vezes');
      table.float('val_prest');
      table.date('dat_entra');
      table.date('dat_prest');
      table.date('dat_entra_payment').nullable();
      table.float('val_entra_payment').nullable();
      table.boolean('status').defaultTo(false);
      table
        .integer('action_id')
        .unsigned()
        .references('actions.id')
        .onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
