import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'negotiation_of_payment_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('comments', 'longtext').nullable()
      table.integer('negotiation_of_payment_id').unsigned().references('negotiation_of_payments.id')
      table.integer('user_id').unsigned().references('users.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
