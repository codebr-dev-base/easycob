import { DateTime } from 'luxon'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import CampaignLot from '#models/campaign_lot'

export default class Campaign extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare num_whatsapp: string

  @column.date()
  declare date: DateTime

  @column()
  declare message: string

  @column()
  declare user_id: number

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column()
  declare file_name: string

  @column()
  declare single_send: boolean

  @hasMany(() => CampaignLot, {
    foreignKey: 'campaign_id',
  })
  declare lots: HasMany<typeof CampaignLot>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare type: string

  @column()
  declare subject: string

  @column()
  declare email: string

  @column()
  declare template_external_id: number
}