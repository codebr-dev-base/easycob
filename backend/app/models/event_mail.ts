import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import CampaignLot from '#models/campaign_lot'

export default class EventMail extends BaseModel {
  //declare static connection = 'pg'
  static table = 'declare.event_mails'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare timestamp: DateTime

  @column()
  declare type: string

  @column()
  declare campaign_lot_id: number

  @belongsTo(() => CampaignLot, {
    foreignKey: 'campaign_lot_id',
  })
  declare campaignLot: BelongsTo<typeof CampaignLot>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}