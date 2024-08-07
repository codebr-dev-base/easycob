import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recupera.tbl_arquivos_cliente_numero'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('block').defaultTo(false)
      table.boolean('block_all').defaultTo(false)
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('block')
      table.dropColumn('block_all')
      table.dropColumn('updated_at')
    })
  }
}
