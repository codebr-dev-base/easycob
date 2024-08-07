import { BaseSchema } from '@adonisjs/lucid/schema'
export default class extends BaseSchema {
  protected tableName = 'actions'
  //Criar retorno do envio do XML
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.bigInteger('cod_credor_des_regis')
      table.bigInteger('matricula_contrato')
      table.string('des_regis')
      table.string('cod_credor')
      table.string('tipo_contato')
      table.string('contato')
      table.integer('type_action_id').unsigned().references('type_actions.id').onDelete('CASCADE')
      table.text('description', 'longtext').nullable()
      table.boolean('sync').defaultTo(false)
      table.text('result_sync').nullable()
      table.integer('user_id').unsigned().references('users.id')
      table.timestamp('synced_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
