import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'add_discount_values'

  async up() {
    this.schema.alterTable('negotiation_of_payments', (table) => {
      table.float('val_discount').nullable()
      table.integer('perc_discount').nullable()
    })
    this.schema.alterTable('promise_of_payments', (table) => {
      table.float('val_discount').nullable()
      table.integer('perc_discount').nullable()
    })
  }

  async down() {
    this.schema.alterTable('negotiation_of_payments', (table) => {
      table.dropColumn('val_discount')
      table.dropColumn('perc_discount')
    })
    this.schema.alterTable('promise_of_payments', (table) => {
      table.dropColumn('val_discount')
      table.dropColumn('perc_discount')
    })
  }
}
