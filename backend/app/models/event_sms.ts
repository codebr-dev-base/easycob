import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import CampaignLot from '#models/campaign_lot';

export default class EventSms extends BaseModel {
  //declare static connection = 'pg'
  static table = 'declare.event_sms';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare timestamp: DateTime;

  @column()
  declare mensagem: string;

  @column()
  declare campaignLotId: number;

  @belongsTo(() => CampaignLot, {
    foreignKey: 'campaignLotId',
  })
  declare campaignLot: BelongsTo<typeof CampaignLot>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}