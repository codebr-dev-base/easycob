import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'last_actions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('action_id').unsigned().references('actions.id')
      table.bigInteger('cod_credor_des_regis')
      table.bigInteger('matricula_contrato')
      table.string('des_regis')
      table.string('cod_credor')
      table.string('tipo_contato')
      table.string('contato')
      table.string('channel').nullable()
      table.string('des_contr').nullable()
      table.integer('type_action_id').unsigned().references('type_actions.id').onDelete('CASCADE')
      table.text('description', 'longtext').nullable()
      table.boolean('sync').defaultTo(false)
      table.text('result_sync', 'longtext').nullable()
      table.integer('user_id').unsigned().references('users.id')
      table.float('val_princ').nullable()
      table.date('dat_venci').nullable()
      table.integer('day_late').nullable()
      table.text('retorno').nullable()
      table.text('retornotexto').nullable()
      table.timestamp('synced_at')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
