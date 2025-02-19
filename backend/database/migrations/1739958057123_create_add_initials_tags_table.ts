import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'tags';

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('initials').nullable().after('name');
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('initials');
    });
  }
}
