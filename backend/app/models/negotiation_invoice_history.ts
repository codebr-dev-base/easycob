import { DateTime } from 'luxon';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import NegotiationInvoice from '#models/negotiation_invoice';
import User from '#models/user';

export default class NegotiationInvoiceHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare negotiationInvoiceId: number;

  @belongsTo(() => NegotiationInvoice, {
    foreignKey: 'negotiationInvoiceId',
  })
  declare negotiationInvoice: BelongsTo<typeof NegotiationInvoice>;

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