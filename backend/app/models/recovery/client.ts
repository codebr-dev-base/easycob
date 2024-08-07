import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Contract from '#models/recovery/contract'
import Invoice from '#models/recovery/invoice'
import Contact from '#models/recovery/contact'

export default class Client extends BaseModel {
  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_clientes'

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare dt_update: DateTime

  @column.date()
  declare dat_movto: DateTime

  @column()
  declare cod_credor_des_regis: number | string

  @column()
  declare cod_credor: string

  @column()
  declare des_regis: string

  @column()
  declare ind_alter: string

  @column()
  declare des_cpf: string

  @column()
  declare nom_clien: string

  @column.date()
  declare dat_nasci: DateTime

  @column()
  declare des_ender_resid: string

  @column()
  declare des_numer_resid: string

  @column()
  declare des_compl_resid: string

  @column()
  declare des_bairr_resid: string

  @column()
  declare des_cidad_resid: string

  @column()
  declare des_estad_resid: string

  @column()
  declare des_cep_resid: string

  @column()
  declare des_fones_resid: string

  @column()
  declare des_fones_comer: string

  @column()
  declare cod_ramal_comer: string

  @column.date()
  declare dat_refer: DateTime

  @column.date()
  declare dat_expir_prazo: DateTime

  @column.date()
  declare dat_cadas_clien: DateTime

  @column.date()
  declare dat_admis: DateTime

  @column()
  declare des_fones_celul: string

  @column()
  declare des_fones1: string

  @column()
  declare des_fones2: string

  @column()
  declare des_email: string

  @column()
  declare desc_cod_movimento: string

  @column()
  declare status: string

  @hasMany(() => Contract, {
    foreignKey: 'cod_credor_des_regis',
    localKey: 'cod_credor_des_regis',
  })
  declare contracts: HasMany<typeof Contract>

  @hasMany(() => Invoice, {
    foreignKey: 'cod_credor_des_regis',
    localKey: 'cod_credor_des_regis',
  })
  declare invoices: HasMany<typeof Invoice>

  @hasMany(() => Contact, {
    foreignKey: 'cod_credor_des_regis',
    localKey: 'cod_credor_des_regis',
  })
  declare contacts: HasMany<typeof Contact>

  @hasMany(() => Contact, {
    foreignKey: 'cod_credor_des_regis',
    localKey: 'cod_credor_des_regis',
  })
  declare phones: HasMany<typeof Contact>

  @hasMany(() => Contact, {
    foreignKey: 'cod_credor_des_regis',
    localKey: 'cod_credor_des_regis',
  })
  declare emails: HasMany<typeof Contact>

  serializeExtras() {
    return {
      val_princ: this.$extras.val_princ,
      val_pago: this.$extras.val_pago,
      count_princ: this.$extras.count_princ,
      count_pago: this.$extras.count_pago,
      dat_venci: this.$extras.dat_venci,
    }
  }
}