import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import PromiseOfPayment from '#models/promise_of_payment';
import User from '#models/user';

export default class PromiseOfPaymentHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare promiseOfPaymentId: number;

  @belongsTo(() => PromiseOfPayment, {
    foreignKey: 'promise_of_payment_id',
  })
  declare promiseOfPayment: BelongsTo<typeof PromiseOfPayment>;

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
