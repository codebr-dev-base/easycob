import { BaseSchema } from '@adonisjs/lucid/schema'
export default class HistoryActions extends BaseSchema {
  protected tableName = 'history_actions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('cod_credor_des_regis').nullable()
      table.bigInteger('matricula_contrato').nullable()
      table.string('des_regis', 255).nullable()
      table.string('cod_credor', 255).nullable()
      table.string('tipo_contato', 255).nullable()
      table.string('contato', 255).nullable()
      table
        .integer('type_action_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('type_actions')
        .onDelete('CASCADE')
      table.text('description').nullable()
      table.boolean('sync').defaultTo(false).nullable()
      table.text('result_sync').nullable()
      table.integer('user_id').unsigned().nullable().references('id').inTable('users')
      table.timestamp('synced_at').nullable()
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.float('val_princ').nullable()
      table.date('dat_venci').nullable()
      table.integer('day_late').nullable()
      table.string('retorno', 255).nullable()
      table.text('retornotexto').nullable()
      table.string('des_contr', 255).nullable()
      table.string('channel', 255).nullable()
      table.boolean('double').defaultTo(false).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
