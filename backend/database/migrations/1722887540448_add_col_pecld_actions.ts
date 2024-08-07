import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'add_col_pecld_actions';

  public async up() {
    this.schema.alterTable('actions', (table) => {
      table.float('pecld').nullable();
    });
    this.schema.alterTable('last_actions', (table) => {
      table.float('pecld').nullable();
    });
    this.schema.alterTable('history_actions', (table) => {
      table.float('pecld').nullable();
    });
  }

  public async down() {
    this.schema.alterTable('actions', (table) => {
      table.dropColumn('pecld');
    });
    this.schema.alterTable('last_actions', (table) => {
      table.dropColumn('pecld');
    });
    this.schema.alterTable('history_actions', (table) => {
      table.dropColumn('pecld');
    });
  }
}
