import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'type_actions';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      //table.boolean('active').defaultTo(false);
      table.boolean('cpc').defaultTo(false);
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      //table.dropColumn('active');
      table.dropColumn('cpc');
    });
  }
}
