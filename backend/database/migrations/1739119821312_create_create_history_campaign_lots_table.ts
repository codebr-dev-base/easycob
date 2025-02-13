import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'history_campaign_lots';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('cod_credor_des_regis', 255);
      table.string('contato', 255);
      table.string('messageid', 255);
      table.string('status', 255);
      table.string('codigo_status', 255);
      table.string('operadora', 255);
      table.string('campo_informado', 255);
      table.text('mensagem');
      table.string('data_retorno', 255);
      table.string('descricao', 255);
      table.string('codigo_campanha', 255);
      table
        .integer('campaign_id')
        .unsigned()
        .references('id')
        .inTable('history_campaigns');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
      table.boolean('valid').defaultTo(true);
      table.string('standardized', 255);
      table.integer('shipping').defaultTo(0);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
