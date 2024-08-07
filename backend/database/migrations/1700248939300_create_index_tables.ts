import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recupera.tbl_arquivos_clientes'
  protected tableClient = 'recupera.tbl_arquivos_clientes'
  protected tableNumero = 'recupera.tbl_arquivos_cliente_numero'
  protected tableContrato = 'recupera.tbl_arquivos_contratos'
  protected tabelaPrestacao = 'recupera.tbl_arquivos_prestacao'

  async up() {

    this.schema.alterTable(this.tableNumero, (table) => {
      table.index(['cod_credor_des_regis'], 'tbl_arquivos_cliente_numero_cod_credor_des_regis_idx')
      table.index(['contato'], 'tbl_arquivos_cliente_numero_contato_idx')
    })

    this.schema.alterTable(this.tableClient, (table) => {
      table.index(['status'], 'tbl_arquivos_clientes_status_idex')
    })

    this.schema.alterTable(this.tableContrato, (table) => {
      table.index(['cod_credor_des_regis'], 'tbl_arquivos_contratos_cod_credor_des_regis_idx')
      table.index(['des_contr'], 'tbl_arquivos_contratos_des_contr_idx')
      table.index(['status'], 'tbl_arquivos_contratos_status_idx')
    })

    this.schema.alterTable(this.tabelaPrestacao, (table) => {
      table.index(['cod_credor_des_regis'], 'tbl_arquivos_prestacao_cod_credor_des_regis_idx')
      table.index(['des_contr'], 'tbl_arquivos_prestacao_des_contr_idx')
      table.index(['status'], 'tbl_arquivos_prestacao_status_idx')
    })
  }

  async down() {
    this.schema.alterTable(this.tableNumero, (table) => {
      table.dropIndex(
        ['cod_credor_des_regis'],
        'recupera.tbl_arquivos_cliente_numero_cod_credor_des_regis_idx'
      )
      table.dropIndex(['contato'], 'recupera.tbl_arquivos_cliente_numero_contato_idx')
    })

    this.schema.alterTable(this.tableClient, (table) => {
      table.dropIndex(['status'], 'recupera.tbl_arquivos_clientes_status_idex')
    })

    this.schema.alterTable(this.tableContrato, (table) => {
      table.dropIndex(
        ['cod_credor_des_regis'],
        'recupera.tbl_arquivos_contratos_cod_credor_des_regis_idx'
      )
      table.dropIndex(['des_contr'], 'recupera.tbl_arquivos_contratos_des_contr_idx')
      table.dropIndex(['status'], 'recupera.tbl_arquivos_contratos_status_idx')
    })

    this.schema.alterTable(this.tabelaPrestacao, (table) => {
      table.dropIndex(
        ['cod_credor_des_regis'],
        'recupera.tbl_arquivos_prestacao_cod_credor_des_regis_idx'
      )
      table.dropIndex(['des_contr'], 'recupera.tbl_arquivos_prestacao_des_contr_idx')
      table.dropIndex(['status'], 'recupera.tbl_arquivos_prestacao_status_idx')
    })
  }
}
