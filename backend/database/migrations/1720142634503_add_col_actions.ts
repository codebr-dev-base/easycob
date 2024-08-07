import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'add_col_actions'

  async up() {
    this.schema.alterTable('actions', (table) => {
      table.boolean('unification_check').defaultTo(false)
    })
    this.schema.alterTable('last_actions', (table) => {
      table.boolean('unification_check').defaultTo(false)
    })
    this.schema.alterTable('history_actions', (table) => {
      table.boolean('unification_check').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable('actions', (table) => {
      table.dropColumn('unification_check')
    })
    this.schema.alterTable('last_actions', (table) => {
      table.dropColumn('unification_check')
    })
    this.schema.alterTable('history_actions', (table) => {
      table.dropColumn('unification_check')
    })
  }
}
