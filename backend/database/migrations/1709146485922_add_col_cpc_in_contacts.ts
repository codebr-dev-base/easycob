import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'recupera.tbl_arquivos_cliente_numero'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('cpc').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('cpc')
    })
  }
}
