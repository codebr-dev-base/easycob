import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import NegotiationOfPayment from '#models/negotiation_of_payment';
import User from '#models/user';

export default class NegotiationOfPaymentHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare negotiationOfPaymentId: number;

  @belongsTo(() => NegotiationOfPayment, {
    foreignKey: 'negotiationOfPaymentId',
  })
  declare negotiationOfPayment: BelongsTo<typeof NegotiationOfPayment>;

  @column()
  declare comments: string;

  @column()
  declare userId: number;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
