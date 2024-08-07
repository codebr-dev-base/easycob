import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'recupera.redistribuicao_carteira_base'

  async up() {
    //super.db = await Database.connection('pg')
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('check').defaultTo(false)
    })
  }

  async down() {
    //super.db = await Database.connection('pg')
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('check')
    })
  }
}
