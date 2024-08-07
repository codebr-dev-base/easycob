import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'public.campaign_lots'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['campaign_id'], 'campaign_lots_campaign_id_idx')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['campaign_id'], 'campaign_lots_campaign_id_idx')
    })
  }
}
