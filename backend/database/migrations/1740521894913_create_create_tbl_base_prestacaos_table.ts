import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'base_externa.tbl_base_prestacoes';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('des_contr').nullable();
      table.date('data_ultimo_pagamento').nullable();
      table.date('ref_nf').nullable();
      table.date('dat_venc').nullable();
      table.integer('dias_venc').nullable();
      table.string('num_nota').nullable();
      table.float('vlr_sc').nullable();
      table.string('tributo').nullable();
      table.string('aging_vencimento').nullable();
      table.string('status').nullable();
      table.timestamp('created_at');
      table.timestamp('updated_at');
    });

    // Adiciona a restrição de unicidade após criar a tabela
    this.defer(async (db) => {
      await db.rawQuery(`
              ALTER TABLE ${this.tableName}
              ADD CONSTRAINT unq_des_contr_num_nota_vlr_sc UNIQUE (des_contr, num_nota, vlr_sc)
            `);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
