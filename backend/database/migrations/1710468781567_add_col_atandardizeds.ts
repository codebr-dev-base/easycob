import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('campaign_lots', (table) => {
      table.string('standardized').nullable()
    })
    this.schema.alterTable('error_campaign_imports', (table) => {
      table.string('standardized').nullable()
    })
  }

  async down() {
    this.schema.alterTable('campaign_lots', (table) => {
      table.dropColumn('standardized')
    })
    this.schema.alterTable('error_campaign_imports', (table) => {
      table.dropColumn('standardized')
    })
  }
}
