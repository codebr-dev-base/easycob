import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.tbl_base_dataset';

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
      table.date('data_ultimo_pagamento').nullable();
      table.date('ref_nf').nullable();
      table.date('dat_venc').nullable();
      table.integer('dias_venc').nullable();
      table.string('num_nota').nullable();
      table.float('vlr_sc').nullable();
      table.string('tributo').nullable();
      table.string('aging_vencimento').nullable();
      table.string('tipo_doc_pri').nullable();
      table.string('num_doc_1').nullable();
      table.string('num_celular').nullable();
      table.string('num_celular_2').nullable();
      table.string('num_residencial').nullable();
      table.string('num_comercial').nullable();
      table.string('num_recado').nullable();
      table.string('dsc_email').nullable();
      table.string('dsc_email_2').nullable();
      table.string('status').nullable();
      table.timestamp('updated_at');
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
