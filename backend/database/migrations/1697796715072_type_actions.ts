import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'type_actions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('abbreviation')
      table.string('name')
      table.integer('commissioned')
      table.string('type').nullable()
      table.integer('timelife')
      table
        .integer('category_action_id')
        .unsigned()
        .references('category_actions.id')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
