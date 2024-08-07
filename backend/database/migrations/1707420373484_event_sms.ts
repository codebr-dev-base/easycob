import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'event_sms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('mensagem')
      table.timestamp('timestamp')
      table.integer('campaign_lot_id').unsigned().references('campaign_lots.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
