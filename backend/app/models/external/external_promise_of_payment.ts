import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import ExternalAction from './external_action.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class ExternalPromiseOfPayment extends BaseModel {
  static table = 'base_externa.promise_of_payments';

  @column({ isPrimary: true })
  declare id: number;

  @column.date()
  declare datPrev: DateTime | null;

  @column()
  declare valPrest: number | null;

  @column.date()
  declare datPayment: DateTime | null;

  @column()
  declare valPayment: number | null;

  @column()
  declare status: boolean;

  @column()
  declare actionId: number | null;

  @belongsTo(() => ExternalAction, {
    localKey: 'actionId',
  })
  declare action: BelongsTo<typeof ExternalAction>;

  @column()
  declare valOriginal: number | null;

  @column()
  declare followingStatus: string | null;

  @column.date()
  declare datBreach: DateTime | null;

  @column()
  declare discount: boolean;

  @column()
  declare valDiscount: number | null;

  @column()
  declare percDiscount: number | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
