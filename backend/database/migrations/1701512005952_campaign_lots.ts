import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'campaign_lots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('cod_credor_des_regis')
      table.string('contato')
      table.string('messageid').nullable()
      table.string('status').nullable()
      table.string('codigo_status').nullable()
      table.string('operadora').nullable()
      table.string('campo_informado').nullable()
      table.text('mensagem').nullable()
      table.string('data_retorno').nullable()
      table.string('descricao').nullable()
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
