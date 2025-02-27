import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import ExternalAction from './external_action.js';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import ExternalNegotiationInvoice from './external_negotiation_invoice.js';

export default class ExternalNegotiationOfPayment extends BaseModel {
  static table = 'base_externa.negotiation_of_payments';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare idNegotiation: string | null;

  @column()
  declare valOriginal: number | null;

  @column()
  declare valTotalPrest: number | null;

  @column()
  declare valEntra: number | null;

  @column()
  declare numVezes: number | null;

  @column()
  declare valPrest: number | null;

  @column.date()
  declare datEntra: DateTime | null;

  @column.date()
  declare datPrest: DateTime | null;

  @column.date()
  declare datEntraPayment: DateTime | null;

  @column()
  declare valEntraPayment: number | null;

  @column()
  declare status: boolean;

  @column()
  declare actionId: number | null;

  @belongsTo(() => ExternalAction, {
    localKey: 'actionId',
  })
  declare action: BelongsTo<typeof ExternalAction>;

  @column.date()
  declare datPayment: DateTime | null;

  @column()
  declare valPayment: number | null;

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

  @hasMany(() => ExternalNegotiationInvoice, {
    foreignKey: 'negotiationOfPaymentId',
  })
  declare invoices: HasMany<typeof ExternalNegotiationInvoice>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
