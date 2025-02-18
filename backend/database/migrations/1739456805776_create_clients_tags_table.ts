import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'clients_tags';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .bigInteger('client_id')
        .unsigned()
        .references('cod_credor_des_regis')
        .inTable('recupera.tbl_arquivos_clientes')
        .onDelete('CASCADE');
      table
        .integer('tag_id')
        .unsigned()
        .references('id')
        .inTable('public.tags')
        .onDelete('CASCADE');
      table.primary(['client_id', 'tag_id']);
      table.timestamps(true);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
