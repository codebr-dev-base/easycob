import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.tbl_base_contratos';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('des_contr').nullable();
      table.integer('emp_codigo').nullable();
      table.bigInteger('chave_contrato').nullable();
      table.bigInteger('num_ligacao').nullable();
      table.bigInteger('seq_responsavel').nullable();
      table.string('nom_cliente').nullable();
      table.string('sit_lig').nullable();
      table.string('ultimo_contrato').nullable();
      table.string('sub_categoria').nullable();
      table.string('comportamento_arrecadacao_6_m', 3000).nullable();
      table.string('status_adimplencia').nullable();
      table.string('flag_grande_cliente').nullable();
      table.string('maior_aging_vencimento').nullable();
      table.string('tipo_doc_pri').nullable();
      table.string('num_doc_1').nullable();
      table.string('status').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });

    // Adiciona a restrição de unicidade após criar a tabela
    this.defer(async (db) => {
      await db.rawQuery(`
            ALTER TABLE ${this.tableName}
            ADD CONSTRAINT unq_des_contr UNIQUE (des_contr)
          `);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
