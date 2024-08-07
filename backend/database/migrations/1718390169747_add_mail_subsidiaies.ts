import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'subsidiaries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email')
      table.string('config_email')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('email')
      table.dropColumn('config_email')
    })
  }
}
