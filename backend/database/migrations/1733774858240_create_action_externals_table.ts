import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'action_externals';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('des_contr').notNullable();
      table.string('nom_loja').notNullable();
      table.string('nom_cliente').notNullable();
      table.string('tipo_contato').notNullable();
      table.string('contato').notNullable();
      table.text('description');
      table.boolean('sync').defaultTo(false);
      table.string('result_sync');
      table.string('channel');
      table
        .integer('type_action_id')
        .unsigned()
        .references('id')
        .inTable('type_actions')
        .onDelete('CASCADE'); // Foreign key
      table.boolean('unification_check').defaultTo(false);
      table.boolean('is_ok').defaultTo(false);
      table.string('wallet');
      table.timestamp('synced_at');

      table.timestamp('created_at');
      table.timestamp('updated_at');
      table.decimal('val_princ', 12, 2); // 12 digits, 2 decimal places

      table.date('dat_venci');
      table.integer('day_late').defaultTo(0);
      table.string('retorno');
      table.text('retornotexto');
      table.boolean('double').defaultTo(false);
      table.decimal('pecld', 12, 2);
      table.string('messageid'); // Novo campo
      table.string('status'); // Novo campo
      table.string('codigo_status'); // Novo campo
      table.text('descricao'); // Novo campo
      table.string('num_whatsapp'); // Novo campo
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
