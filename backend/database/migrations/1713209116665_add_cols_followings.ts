import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'add_cols_followings'

  async up() {
    this.schema.alterTable('negotiation_invoices', (table) => {
      table.string('following_status').nullable()
      table.date('dat_breach').nullable()
    })
    this.schema.alterTable('negotiation_of_payments', (table) => {
      table.string('following_status').nullable()
      table.date('dat_breach').nullable()
    })
    this.schema.alterTable('promise_of_payments', (table) => {
      table.string('following_status').nullable()
      table.date('dat_breach').nullable()
    })
  }

  async down() {
    this.schema.alterTable('negotiation_invoices', (table) => {
      table.dropColumn('following_status')
      table.dropColumn('dat_breach')
    })
    this.schema.alterTable('negotiation_of_payments', (table) => {
      table.dropColumn('following_status')
      table.dropColumn('dat_breach')
    })
    this.schema.alterTable('promise_of_payments', (table) => {
      table.dropColumn('following_status')
      table.dropColumn('dat_breach')
    })
  }
}
