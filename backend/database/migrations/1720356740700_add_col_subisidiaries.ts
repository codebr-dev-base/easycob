import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'subsidiaries'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('nom_loja').nullable()
      table.string('loja').nullable()
      table.string('credor').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('nom_loja')
      table.dropColumn('loja')
      table.dropColumn('credor')
    })
  }
}
