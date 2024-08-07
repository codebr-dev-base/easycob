import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Contact extends BaseModel {
  //declare static connection = 'recover'
  static table = 'recupera.tbl_arquivos_cliente_numero'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cod_credor_des_regis: number | string

  @column()
  declare tipo_contato: string

  @column()
  declare contato: string

  @column.date()
  declare dt_import: DateTime

  @column()
  declare is_whatsapp: boolean

  @column()
  declare cpc: boolean

  @column()
  declare numero_whats: string

  @column()
  declare block: boolean

  @column()
  declare block_all: boolean

  @column()
  declare percentual_atender: number

  @column()
  declare count_atender: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}