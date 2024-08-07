import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'campaigns'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enu('type', ['SMS', 'EMAIL'], {
          useNative: true,
          enumName: `${this.tableName}_type`,
          existingType: false,
        })
        .defaultTo('SMS')
      table.string('email').nullable()
      table.string('subject').nullable()
      table.setNullable('num_whatsapp')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      this.schema.raw(`DROP TYPE IF EXISTS "${this.tableName}_type"`)
      table.dropColumn('type')
      table.dropColumn('email')
      table.dropColumn('subject')
    })
  }
}
