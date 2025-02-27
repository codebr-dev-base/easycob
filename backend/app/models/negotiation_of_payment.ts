import { DateTime } from 'luxon';
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import Action from '#models/action';
import NegotiationInvoice from '#models/negotiation_invoice';

export default class NegotiationOfPayment extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare idNegotiation: string;

  @column()
  declare valOriginal: number;

  @column()
  declare valTotalPrest: number;

  @column()
  declare valEntra: number;

  @column()
  declare numVezes: number;

  @column()
  declare valPrest: number;

  @column()
  declare valDiscount: number;

  @column()
  declare percDiscount: number;

  @column.date()
  declare datEntra: DateTime;

  @column.date()
  declare datPrest: DateTime;

  @column.date()
  declare datEntraPayment: DateTime;

  @column()
  declare valEntraPayment: number;

  @column()
  declare status: boolean;

  @column()
  declare followingStatus: string;

  @column.date()
  declare datBreach: DateTime;

  @column()
  declare actionId: number;

  @column()
  declare discount: boolean;

  @belongsTo(() => Action, {
    localKey: 'actionId',
  })
  declare action: BelongsTo<typeof Action>;

  @hasMany(() => NegotiationInvoice, {
    foreignKey: 'negotiationOfPaymentId',
  })
  declare invoices: HasMany<typeof NegotiationInvoice>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
