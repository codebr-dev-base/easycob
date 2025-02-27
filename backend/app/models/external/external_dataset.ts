import { DateTime } from 'luxon';
import { BaseModel, column } from '@adonisjs/lucid/orm';

export default class ExternalDataset extends BaseModel {
  static table = 'base_externa.tbl_base_dataset';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare des_contr: string | null;

  @column()
  declare emp_codigo: number | null;

  @column()
  declare chave_contrato: bigint | null;

  @column()
  declare num_ligacao: bigint | null;

  @column()
  declare seq_responsavel: bigint | null;

  @column()
  declare nom_cliente: string | null;

  @column()
  declare sit_lig: string | null;

  @column()
  declare ultimo_contrato: string | null;

  @column()
  declare sub_categoria: string | null;

  @column()
  declare comportamento_arrecadacao_6_m: string | null;

  @column()
  declare status_adimplencia: string | null;

  @column()
  declare flag_grande_cliente: string | null;

  @column()
  declare maior_aging_vencimento: string | null;

  @column.date()
  declare data_ultimo_pagamento: DateTime | null;

  @column.date()
  declare ref_nf: DateTime | null;

  @column.date()
  declare dat_venc: DateTime | null;

  @column()
  declare dias_venc: number | null;

  @column()
  declare num_nota: string | null;

  @column()
  declare vlr_sc: number | null;

  @column()
  declare tributo: string | null;

  @column()
  declare aging_vencimento: string | null;

  @column()
  declare tipo_doc_pri: string | null;

  @column()
  declare num_doc_1: string | null;

  @column()
  declare num_celular: string | null;

  @column()
  declare num_celular_2: string | null;

  @column()
  declare num_residencial: string | null;

  @column()
  declare num_comercial: string | null;

  @column()
  declare num_recado: string | null;

  @column()
  declare dsc_email: string | null;

  @column()
  declare dsc_email_2: string | null;

  @column.date()
  declare updatedAt: DateTime;
}
