import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from '#models/recovery/client'

export default class Invoice extends BaseModel {
  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_prestacao'

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare dt_update: DateTime

  @column.date()
  declare dat_movto: DateTime

  @column()
  declare cod_credor_des_regis: number | string

  @column()
  declare matricula_contrato: number

  @column()
  declare cod_credor: string

  @column()
  declare des_regis: string

  @column()
  declare des_contr: string

  @column.date()
  declare dat_venci: DateTime

  @column.date()
  declare dat_corre: DateTime

  @column.date()
  declare dat_pagam: DateTime

  @column()
  declare val_princ: number

  @column()
  declare val_corre: number

  @column()
  declare val_encar: number

  @column()
  declare val_minim: number

  @column()
  declare val_pago: number

  @column()
  declare qtd_prest: string

  @column()
  declare ind_alter: string

  @column()
  declare ind_baixa: string

  @column()
  declare id_prest: number

  @column()
  declare desc_cod_movimento: string

  @column()
  declare identificador_baixa: string

  @column()
  declare status: string

  @column()
  declare matricula_antiga: string

  @belongsTo(() => Client, {
    foreignKey: 'cod_credor_des_regis',
    localKey: 'cod_credor_des_regis',
  })
  declare client: BelongsTo<typeof Client>
}