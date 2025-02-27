import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.actions';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('des_contr', 255).nullable();
      table.string('cod_credor', 255).nullable();
      table.string('tipo_contato', 255).nullable();
      table.string('contato', 255).nullable();
      table.integer('type_action_id').unsigned().nullable();
      table.text('description').nullable();
      table.float('val_princ').nullable();
      table.float('pecld').nullable();
      table.date('dat_venci').nullable();
      table.integer('day_late').nullable();
      table.string('channel', 255).nullable();
      table.boolean('double').defaultTo(false);
      table.integer('user_id').unsigned().nullable();
      table
        .foreign('type_action_id')
        .references('id')
        .inTable('type_actions')
        .onDelete('CASCADE');

      table.foreign('user_id').references('id').inTable('users');

      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
