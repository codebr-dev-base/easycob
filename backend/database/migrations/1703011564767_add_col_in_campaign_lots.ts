import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'campaign_lots'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('valid').defaultTo(true)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('valid')
    })
  }
}
