import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Action from '#models/action';

export default class PromiseOfPayment extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column.date()
  declare datPrev: DateTime;

  @column()
  declare valPrest: number;

  @column()
  declare valDiscount: number;

  @column()
  declare percDiscount: number;

  @column()
  declare valOriginal: number;

  @column.date()
  declare datPayment: DateTime;

  @column()
  declare valPayment: number;

  @column()
  declare followingStatus: string;

  @column.date()
  declare datBreach: DateTime;

  @column()
  declare actionId: number;

  @column()
  declare discount: boolean;

  @column()
  declare status: boolean;

  @belongsTo(() => Action, {
    localKey: 'actionId',
  })
  declare action: BelongsTo<typeof Action>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}