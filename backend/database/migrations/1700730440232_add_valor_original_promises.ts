import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'promise_of_payments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.float('val_original').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('val_original')
    })
  }
}
