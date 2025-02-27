import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import NegotiationOfPayment from '#models/negotiation_of_payment';

export default class NegotiationInvoice extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare valPrest: number;

  @column.date()
  declare datPrest: DateTime;

  @column()
  declare valPayment: number;

  @column.date()
  declare datPayment: DateTime;

  @column()
  declare status: boolean;

  @column()
  declare followingStatus: string;

  @column.date()
  declare datBreach: DateTime;

  @column()
  declare negotiationOfPaymentId: number;

  @belongsTo(() => NegotiationOfPayment, {
    localKey: 'negotiationOfPaymentId',
  })
  declare negotiation: BelongsTo<typeof NegotiationOfPayment>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
