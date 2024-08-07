import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'public.campaign_lots'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['contato'], 'campaign_lots_contato_idx')
      table.index(['messageid'], 'campaign_lots_messageid_idx')
      table.index(['valid'], 'campaign_lots_valid_idx')
      table.index(['contato', 'valid', 'messageid'], 'campaign_lots_contato_valid_messageid_idx')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['contato'], 'campaign_lots_contato_idx')
      table.dropIndex(['messageid'], 'campaign_lots_messageid_idx')
      table.dropIndex(['valid'], 'campaign_lots_valid_idx')
      table.dropIndex(
        ['contato', 'valid', 'messageid'],
        'campaign_lots_contato_valid_messageid_idx'
      )
    })
  }
}
