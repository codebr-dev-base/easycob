import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ErrorCampaignImport extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cod_credor_des_regis: string

  @column()
  declare contato: string

  @column()
  declare codigo_campanha: string

  @column()
  declare standardized: string

  @column()
  declare status: string

  @column()
  declare campaign_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}