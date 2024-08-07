import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email').notNullable().unique()
      table.string('name').notNullable()
      table.string('cpf').nullable()
      table.string('phone').nullable()
      table.string('password').notNullable()
      table.boolean('is_actived').defaultTo(false)
      table.string('remember_me_token').nullable()
      table.timestamp('password_expires_at', { useTz: true }).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
