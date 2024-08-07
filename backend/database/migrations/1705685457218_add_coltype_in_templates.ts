import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'add_coltype_in_templates'
  //'template_sms'
  //'template_emails'
  async up() {
    this.schema.alterTable('template_sms', (table) => {
      table.string('type').nullable()
    })
    this.schema.alterTable('template_emails', (table) => {
      table.string('type').nullable()
    })
  }

  async down() {
    this.schema.alterTable('template_sms', (table) => {
      table.dropColumn('type')
    })
    this.schema.alterTable('template_emails', (table) => {
      table.dropColumn('type')
    })
  }
}
