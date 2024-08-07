import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'subsidiaries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('nom_loja')
      table.string('cod_credor').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('cod_credor')
      table.string('nom_loja').nullable()
    })
  }
}
