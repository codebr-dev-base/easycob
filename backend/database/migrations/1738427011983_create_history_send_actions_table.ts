import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'history_send_actions';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('action_id')
        .unsigned()
        .references('id')
        .inTable('actions')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE'); // user_id
      table.integer('count_sends').defaultTo(0).nullable();
      table.text('retorno').nullable();
      table.text('retornotexto').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
