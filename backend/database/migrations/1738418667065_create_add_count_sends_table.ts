import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  //protected tableName = 'actions';
  //protected tableName = 'history_actions';

  async up() {
    this.schema.alterTable('actions', (table) => {
      table.integer('count_sends').defaultTo(0).nullable();
    });
    this.schema.alterTable('history_actions', (table) => {
      table.integer('count_sends').defaultTo(0).nullable();
    });
    this.schema.alterTable('last_actions', (table) => {
      table.integer('count_sends').defaultTo(0).nullable();
    });
  }

  async down() {
    this.schema.alterTable('actions', (table) => {
      table.dropColumn('count_sends');
    });
    this.schema.alterTable('history_actions', (table) => {
      table.dropColumn('count_sends');
    });
    this.schema.alterTable('last_actions', (table) => {
      table.dropColumn('count_sends');
    });
  }
}
