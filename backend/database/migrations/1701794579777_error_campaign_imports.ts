import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'error_campaign_imports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('cod_credor_des_regis')
      table.string('contato')
      table.string('status').nullable()
      table.string('codigo_campanha')
      table.integer('campaign_id').unsigned().references('campaigns.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
