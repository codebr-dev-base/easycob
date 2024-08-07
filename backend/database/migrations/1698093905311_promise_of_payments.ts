import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'promise_of_payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('dat_prev')
      table.float('val_prest')
      table.date('dat_payment').nullable()
      table.float('val_payment').nullable()
      table.boolean('status').defaultTo(false)
      table.integer('action_id').unsigned().references('actions.id').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
