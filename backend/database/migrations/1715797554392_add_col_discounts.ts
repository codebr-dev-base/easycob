import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'add_col_discounts'

  async up() {
    this.schema.alterTable('negotiation_of_payments', (table) => {
      table.boolean('discount').defaultTo(false)
    })
    this.schema.alterTable('promise_of_payments', (table) => {
      table.boolean('discount').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable('negotiation_of_payments', (table) => {
      table.dropColumn('discount')
    })
    this.schema.alterTable('promise_of_payments', (table) => {
      table.dropColumn('discount')
    })
  }
}
