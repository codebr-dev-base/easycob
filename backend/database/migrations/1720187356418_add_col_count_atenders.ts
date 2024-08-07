import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'recupera.tbl_arquivos_cliente_numero'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('count_atender').defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('count_atender')
    })
  }
}
