import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'actions'

  async up() {
    this.schema.alterTable('actions', (table) => {
      table.boolean('double').nullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable('actions', (table) => {
      table.dropColumn('double')
    })
  }
}
