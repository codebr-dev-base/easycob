import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm';
import TypeAction from '#models/type_action';
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations';
import User from '#models/user';
import ExternalPromiseOfPayment from './external_promise_of_payment.js';
import ExternalNegotiationOfPayment from './external_negotiation_of_payment.js';

export default class ExternalAction extends BaseModel {
  static table = 'base_externa.actions';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare desContr: string | null;

  @column()
  declare codCredor: string | null;

  @column()
  declare tipoContato: string | null;

  @column()
  declare contato: string | null;

  @column()
  declare typeActionId: number | null;

  @belongsTo(() => TypeAction, {
    foreignKey: 'typeActionId',
  })
  declare typeAction: BelongsTo<typeof TypeAction>;

  @column()
  declare description: string | null;

  @column()
  declare valPrinc: number | null;

  @column()
  declare pecld: number | null;

  @column.date()
  declare datVenci: DateTime | null;

  @column()
  declare dayLate: number | null;

  @column()
  declare channel: string | null;

  @column()
  declare double: boolean;

  @column()
  declare userId: number;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @hasMany(() => ExternalPromiseOfPayment, {
    foreignKey: 'actionId',
  })
  declare promises: HasMany<typeof ExternalPromiseOfPayment>;

  @hasMany(() => ExternalNegotiationOfPayment, {
    foreignKey: 'actionId',
  })
  declare negotiations: HasMany<typeof ExternalNegotiationOfPayment>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
