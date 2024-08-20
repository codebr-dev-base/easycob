import { DateTime } from 'luxon';
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import CampaignLot from '#models/campaign_lot';

export default class Campaign extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare numWhatsapp: string;

  @column.date()
  declare date: DateTime;

  @column()
  declare message: string;

  @column()
  declare userId: number;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @column()
  declare fileName: string;

  @column()
  declare singleSend: boolean;

  @hasMany(() => CampaignLot, {
    foreignKey: 'campaignId',
  })
  declare lots: HasMany<typeof CampaignLot>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column()
  declare type: string;

  @column()
  declare subject: string;

  @column()
  declare email: string;

  @column()
  declare templateExternalId: number;
}