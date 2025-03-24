import { DateTime } from 'luxon';
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations';
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import TypeAction from '#models/type_action';
import Contract from '#models/recovery/contract';
import PromiseOfPayment from '#models/promise_of_payment';
import NegotiationOfPayment from '#models/negotiation_of_payment';
import User from '#models/user';
import Client from '#models/recovery/client';
import Action from '#models/action';

export default class LastAction extends BaseModel {
  //declare static connection = 'pg'

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare actionId: number;

  @column()
  declare actionUuid: string;

  @belongsTo(() => Action, {
    foreignKey: 'actionUuid',
  })
  declare action: BelongsTo<typeof Action>;

  @column()
  declare codCredorDesRegis: number | string;

  @column()
  declare desRegis: string;

  @column()
  declare matriculaContrato: number;

  @column()
  declare desContr: string;

  @column()
  declare codCredor: string;

  @column()
  declare tipoContato: string;

  @column()
  declare contato: string;

  @column()
  declare description: string;

  @column()
  declare sync: boolean;

  @column()
  declare resultSync: string;

  @column()
  declare channel: string;

  @column()
  declare typeActionId: number;

  @column()
  declare unificationCheck: boolean;

  @belongsTo(() => TypeAction, {
    foreignKey: 'typeActionId',
  })
  declare typeAction: BelongsTo<typeof TypeAction>;

  @column()
  declare userId: number;

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>;

  @belongsTo(() => Client, {
    foreignKey: 'codCredorDesRegis',
    localKey: 'codCredorDesRegis',
  })
  declare client: BelongsTo<typeof Client>;

  @column()
  declare contracts: Contract[];

  @hasMany(() => PromiseOfPayment, {
    foreignKey: 'actionId',
  })
  declare promises: HasMany<typeof PromiseOfPayment>;

  @hasMany(() => NegotiationOfPayment, {
    foreignKey: 'actionId',
  })
  declare negotiations: HasMany<typeof NegotiationOfPayment>;

  @column.dateTime()
  declare synced_at: DateTime;

  @column.dateTime()
  declare createdAt: DateTime;

  @column.dateTime()
  declare updatedAt: DateTime;

  @column()
  declare valPrinc: number;

  @column.date()
  declare datVenci: DateTime;

  @column()
  declare dayLate: number;

  @column()
  declare pecld: number;

  @column()
  declare valTotal: number;

  @column.date()
  declare datVenciTotal: DateTime;

  @column()
  declare dayLateTotal: number;

  @column()
  declare pecldTotal: number;

  @column()
  declare retorno: string | null;

  @column()
  declare retornotexto: string;

  @column()
  declare double: boolean;

  @column()
  declare countSends: number;
}
