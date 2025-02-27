import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import ExternalNegotiationOfPayment from './external_negotiation_of_payment.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

export default class ExternalNegotiationInvoice extends BaseModel {
  static table = 'base_externa.negotiation_invoices';

  @column({ isPrimary: true })
  declare id: number;

  @column.date()
  declare datPrest: DateTime | null;

  @column()
  declare valPrest: number | null;

  @column.date()
  declare datPayment: DateTime | null;

  @column()
  declare valPayment: number | null;

  @column()
  declare status: boolean;

  @column()
  declare negotiationOfPaymentId: number | null;

  @belongsTo(() => ExternalNegotiationOfPayment, {
    localKey: 'negotiationOfPaymentId',
  })
  declare negotiation: BelongsTo<typeof ExternalNegotiationOfPayment>;

  @column()
  declare followingStatus: string | null;

  @column.date()
  declare datBreach: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
