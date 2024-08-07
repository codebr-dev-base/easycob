import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'actions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('val_princ').nullable()
      table.date('dat_venci').nullable()
      table.integer('day_late').nullable()
      table.text('retorno').nullable()
      table.text('retornotexto').nullable()
    })
  }
  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('val_princ')
      table.dropColumn('dat_venci')
      table.dropColumn('day_late')
      table.dropColumn('retorno')
      table.dropColumn('retornotexto')
    })
  }
}
